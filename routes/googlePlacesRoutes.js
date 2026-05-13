const express =
  require("express");

const router =
  express.Router();

const {
  searchPlaces,
  getPlaceDetailsController,
} = require(
  "../controllers/googlePlacesController"
);

router.get(
  "/search",
  searchPlaces
);

router.get(
  "/details/:placeId",
  getPlaceDetailsController
);

module.exports =
  router;