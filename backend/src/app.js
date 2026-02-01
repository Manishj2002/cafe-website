const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  req.io = req.app.get('socketio');
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use('/api/public', require('./routes/publicRoutes'));
// In server.js, add:

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Sunil Cafe API is running 🚀",
    location: "Bhopalgarh, Jodhpur",
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
