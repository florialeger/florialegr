const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/test-env:
 *   get:
 *     summary: Test environment variables
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Returns environment variables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mongoUri:
 *                   type: string
 *                   description: MongoDB connection URI
 *                 emailUser:
 *                   type: string
 *                   description: Email user
 *                 port:
 *                   type: string
 *                   description: Server port
 */
router.get("/test-env", (req, res) => {
  res.json({
    mongoUri: process.env.MONGO_URI,
    emailUser: process.env.EMAIL_USER,
    port: process.env.PORT,
  });
});

module.exports = router;