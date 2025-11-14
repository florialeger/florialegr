const express = require('express');
const mongoose = require('mongoose');
const { getGFS } = require('../config/gridfs');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file to GridFS
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       500:
 *         description: Internal server error
 */
router.post('/upload', upload.single('file'), (req, res) => {
  res.status(201).json({ file: req.file });
});

/**
 * @swagger
 * /api/files/{filename}:
 *   get:
 *     summary: Retrieve a file by its filename
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    // Prefer gridfs-stream if available, otherwise use the native GridFSBucket
    const gfs = getGFS();
    let file;

    if (gfs && gfs.files) {
      file = await gfs.files.findOne({ filename });
    } else {
      // fallback to GridFSBucket
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
      const filesCursor = bucket.find({ filename });
      const files = await filesCursor.toArray();
      file = files && files.length ? files[0] : null;
    }

    if (!file) return res.status(404).json({ error: 'File not found' });

    const contentType = file.contentType || 'application/octet-stream';
    const total = file.length;

    // Support range requests for efficient video streaming / seeking
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
        return res.status(416).set('Content-Range', `bytes */${total}`).end();
      }

      const chunkSize = end - start + 1;
      res.status(206);
      res.set({
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });

      // Stream the requested range
      if (gfs && gfs.createReadStream) {
        const stream = gfs.createReadStream({ filename, range: { startPos: start, endPos: end } });
        stream.on('error', (err) => {
          console.error('GridFS read error (range):', err);
          res.end();
        });
        stream.pipe(res);
      } else {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        const stream = bucket.openDownloadStream(file._id, { start, end });
        stream.on('error', (err) => {
          console.error('GridFSBucket read error (range):', err);
          res.end();
        });
        stream.pipe(res);
      }
      return;
    }

    // No range: stream full file
    res.set({ 'Content-Type': contentType, 'Content-Length': total, 'Accept-Ranges': 'bytes' });
    if (gfs && gfs.createReadStream) {
      const stream = gfs.createReadStream(file.filename);
      stream.on('error', (err) => {
        console.error('GridFS read error:', err);
        res.end();
      });
      stream.pipe(res);
    } else {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
      const stream = bucket.openDownloadStream(file._id);
      stream.on('error', (err) => {
        console.error('GridFSBucket read error:', err);
        res.end();
      });
      stream.pipe(res);
    }
  } catch (err) {
    console.error('File download error:', err);
    res.status(500).json({ error: 'Unable to retrieve file' });
  }
});

module.exports = router;
