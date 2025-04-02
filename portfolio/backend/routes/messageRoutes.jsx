const express = require("express");
const { sendMessage } = require("../controllers/messageController.jsx");
const { validateMessage, handleValidationErrors } = require("../config/validation.jsx");

const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message via the contact form
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Hey!"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               from:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               message:
 *                 type: string
 *                 example: "This is a test message."
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.post(
  "/messages",
  validateMessage,
  handleValidationErrors,
  sendMessage
);

module.exports = router;