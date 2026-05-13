const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const businessRoutes = require("./routes/businessRoutes");
const publicRoutes = require("./routes/publicRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const googlePlacesRoutes = require("./routes/googlePlacesRoutes");
const autoBusinessRoutes = require("./routes/autoBusinessRoutes");
const qrRoutes = require("./routes/qrRoutes");
const reviewSessionRoutes = require("./routes/reviewSessionRoutes");
const seoRoutes = require("./routes/seoRoutes");

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ReviewBoost AI API - Server Running Successfully",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/google-places", googlePlacesRoutes);
app.use("/api/auto-business", autoBusinessRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/review-session", reviewSessionRoutes);
app.use("/api/seo", seoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: "Route not found",
    success: false,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
