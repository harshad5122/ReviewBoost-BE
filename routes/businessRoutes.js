const express = require("express");
const businessController = require("../controllers/businessController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, businessController.createBusiness);
router.get("/", authMiddleware, businessController.getAllBusinesses);
router.get("/search", authMiddleware, businessController.searchBusinesses);
router.get("/:id", authMiddleware, businessController.getBusinessById);
router.put("/:id", authMiddleware, businessController.updateBusiness);
router.delete("/:id", authMiddleware, businessController.deleteBusiness);

module.exports = router;
