const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────
// Removed: No longer needed with Cloudinary
// app.use("/uploads", express.static("uploads"));
// ────────────────────────────────────────────────

// Optional: keep this if you still have other static files (e.g. public folder)
// but in most cases you can remove it too if nothing else uses static serving
// app.use(express.static("public"));   // ← only if you have one

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