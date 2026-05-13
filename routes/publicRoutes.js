const express = require("express");
const businessController = require("../controllers/businessController");
const reviewController = require("../controllers/reviewController");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

// Public routes
router.get("/business/:slug", businessController.getBusinessBySlug);
router.post("/track-event", analyticsController.trackEvent);

module.exports = router;
