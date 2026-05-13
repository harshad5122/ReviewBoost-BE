const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/track", analyticsController.trackEvent);
router.get("/user", authMiddleware, analyticsController.getUserAnalytics);
router.get("/business/:businessId", authMiddleware, analyticsController.getBusinessAnalytics);
router.get("/business/:businessId/aggregated", authMiddleware, analyticsController.getAggregatedAnalytics);

module.exports = router;
