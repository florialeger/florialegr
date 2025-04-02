const mongoose = require("mongoose");

const playgroundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  context: String,
  created: String,
  support: String,
  primaryImage: { type: [String], required: true },
  type: { type: String, enum: ["ux", "illustration"], required: true },
  secondaryImages: [String],
  slug: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Playground", playgroundSchema);