const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  generateBusinessQR,
} = require(
  "../controllers/qrController"
);

router.post(
  "/generate",
  authMiddleware,
  generateBusinessQR
);

module.exports =
  router;