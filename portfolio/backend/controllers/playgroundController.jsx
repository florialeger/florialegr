const Playground = require("../models/playground.jsx");

// Get all playgrounds
exports.getPlaygrounds = async (req, res) => {
  try {
    const playgrounds = await Playground.find();
    res.status(200).json(playgrounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single playground by ID
exports.getPlaygroundById = async (req, res) => {
  try {
    const playground = await Playground.findById(req.params.id);
    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }
    res.status(200).json(playground);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new playground
exports.addPlayground = async (req, res) => {
  try {
    const playground = new Playground(req.body);
    await playground.save();
    res.status(201).json(playground);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a playground by ID
exports.updatePlayground = async (req, res) => {
  try {
    const playground = await Playground.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });
    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }
    res.status(200).json(playground);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a playground by ID
exports.deletePlayground = async (req, res) => {
  try {
    const playground = await Playground.findByIdAndDelete(req.params.id);
    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }
    res.status(200).json({ message: "Playground deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};