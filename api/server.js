require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("../config/db");
const itemRoutes = require("../routes/itemRoutes");
const errorHandler = require("../middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/", itemRoutes);

// Health check endpoint (critical for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: Date.now() });
});

// Error handling
app.use(errorHandler);

// Server setup for local development
if (require.main === module) {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;