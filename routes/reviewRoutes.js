const express = require("express");
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/:slug", reviewController.getReviewPage);

// Protected routes
router.post("/generate", authMiddleware, reviewController.generateReview);
router.get("/user/all", authMiddleware, reviewController.getUserReviews);

module.exports = router;
