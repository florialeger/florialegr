const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  context: { type: [String], default: [] },
  created: { type: String, required: true },
  duration: { type: String },
  projectDuty: { type: [String], default: [] },
  support: { type: [String], default: [] },
  primaryImage: { type: [String], required: true, default: [] },
  type: { type: String, enum: ['ux_ui', 'illustration'], required: true },
  secondaryImages: { type: [String], default: [] },
  link: { type: [linkSchema], default: [] },
  locked: { type: Boolean, default: false },
  slug: { type: String, unique: true, required: true, trim: true },
});

module.exports = mongoose.model('Project', projectSchema);
