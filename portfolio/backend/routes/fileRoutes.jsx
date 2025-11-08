const express = require('express');
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
  const gfs = getGFS();
  const file = await gfs.files.findOne({ filename: req.params.filename });

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  if (file.contentType.startsWith('image')) {
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } else {
    res.status(400).json({ error: 'The file is not an image' });
  }
});

module.exports = router;
