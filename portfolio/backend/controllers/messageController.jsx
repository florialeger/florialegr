const Message = require("../models/message.jsx");
const nodemailer = require("nodemailer");

const sendMessage = async (req, res) => {
  try {
    const { subject, name, from, message } = req.body;

    // Save the message to the database
    const newMessage = new Message({ subject, name, from, message });
    await newMessage.save();

    // Configure nodemailer to send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    // Email options
    const mailOptions = {
      from: from, // Sender's email
      to: process.env.EMAIL_USER, // Your Gmail address
      subject: `New Message: ${subject}`,
      text: `You received a new message from ${name} (${from}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while sending the message." });
  }
};

module.exports = { sendMessage };