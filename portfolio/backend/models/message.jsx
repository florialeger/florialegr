const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    default: "Hey!",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  from: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        // Regex for validating email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "Invalid email address",
    },
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);