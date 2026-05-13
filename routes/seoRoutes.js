const express =
  require("express");

const router =
  express.Router();

const {
  generateSeoPage,

  getSeoPage,
} = require(
  "../controllers/seoController"
);

router.post(
  "/generate",
  generateSeoPage
);

router.get(
  "/:slug",
  getSeoPage
);

module.exports =
  router;