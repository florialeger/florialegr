const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.jsx");
const swaggerDocs = require("./config/swagger.jsx");

// Import Routes
const projectRoutes = require("./routes/projectRoutes.jsx");
const playgroundRoutes = require("./routes/playgroundRoutes.jsx");
const messageRoutes = require("./routes/messageRoutes.jsx");
const testRoutes = require("./routes/testRoutes.jsx");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/playgrounds", playgroundRoutes);
app.use("/api/messages", messageRoutes); 
app.use("/api", testRoutes);

// Swagger Documentation
swaggerDocs(app); // Initialize Swagger

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
