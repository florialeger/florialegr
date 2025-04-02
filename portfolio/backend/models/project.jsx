const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  context: String,
  created: { type: String, required: false },
    duration: { type: String },
  projectDuty: String,
  support: String,
  primaryImage: { type: [String], required: true },
  type: { type: String, enum: ["ux", "illustration"], required: true },
  secondaryImages: [String],
  link: { type: String },
  slug: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Project", projectSchema);