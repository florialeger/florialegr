const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const playgroundSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  context: { type: [String], default: [] },
  created: { type: String, required: true },
  support: { type: [String], default: [] },
  primaryImage: { type: [String], required: true, default: [] },
  type: { type: String, enum: ['ux_ui', 'illustration'], required: true },
  secondaryImages: { type: [String], default: [] },
  link: { type: [linkSchema], default: [] },
  slug: { type: String, unique: true, required: true, trim: true },
});

module.exports = mongoose.model('Playground', playgroundSchema);
