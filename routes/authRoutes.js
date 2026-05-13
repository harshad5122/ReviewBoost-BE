const express = require("express");

const {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middleware/validation");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validateUserRegistration, register);

router.post("/login", validateUserLogin, login);

router.post("/refresh-token", refreshToken);

router.post("/logout", authMiddleware, logout);

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
