const mongoose = require('mongoose');

const connectDB = async () => {
  // If no MONGO_URI is provided, do not exit — run the server in degraded/static mode.
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set — skipping MongoDB connection. Server will run without DB.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    // Initialize GridFS helper with the active mongoose connection.
    try {
      const { connectGridFS } = require('./gridfs');
      connectGridFS(mongoose.connection);
      console.log('GridFS initialized');
    } catch (err) {
      console.warn('GridFS initialization skipped:', err.message || err);
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Do not exit the process; run the server without DB so the frontend/static endpoints remain available.
  }
};

module.exports = connectDB;
