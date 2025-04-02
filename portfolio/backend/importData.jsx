const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Project = require("./models/project.jsx");
const Playground = require("./models/playground.jsx");
const data = require("../data.json");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    // Clear existing data (optional, remove if you don't want to delete existing data)
    // await Project.deleteMany();
    // await Playground.deleteMany();

    // Insert or update projects
    for (const project of data.projects) {
      await Project.updateOne(
        { slug: project.slug }, // Find by unique field (slug)
        { $set: project }, // Update the document if it exists
        { upsert: true } // Insert if it doesn't exist
      );
    }

    // Insert or update playgrounds
    for (const playground of data.playgrounds) {
      await Playground.updateOne(
        { slug: playground.slug }, // Find by unique field (slug)
        { $set: playground }, // Update the document if it exists
        { upsert: true } // Insert if it doesn't exist
      );
    }

    console.log("Data imported successfully without duplicates");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error.message);
    process.exit(1);
  }
};

importData();