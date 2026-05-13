const express =
  require("express");

const router =
  express.Router();

const {
  createReviewSession,

  markRedirectedToGoogle,
} = require(
  "../controllers/reviewSessionController"
);

router.post(
  "/create",
  createReviewSession
);

router.post(
  "/redirect-google",
  markRedirectedToGoogle
);

module.exports =
  router;