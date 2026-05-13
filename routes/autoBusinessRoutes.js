const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  createBusinessFromPlace,
} = require(
  "../controllers/autoBusinessController"
);

router.post(
  "/create-from-place",
  authMiddleware,
  createBusinessFromPlace
);

module.exports =
  router;