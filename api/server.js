require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("../config/db");
const itemRoutes = require("../routes/urlRoutes");
const errorHandler = require("../middleware/errorMiddleware");
const swaggerSpec = require("../config/swagger");
const swaggerUi = require('swagger-ui-express');

// Connect to MongoDB
connectDB();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use("/", itemRoutes);

// Health check endpoint (critical for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: Date.now() });
});


app.use("/swagger/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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