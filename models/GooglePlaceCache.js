const mongoose = require("mongoose");

const googlePlaceCacheSchema =
  new mongoose.Schema({
    placeId: {
      type: String,
      unique: true,
    },

    businessName: String,

    formattedAddress: String,

    category: String,

    rating: Number,

    totalRatings: Number,

    phoneNumber: String,

    website: String,

    latitude: Number,

    longitude: Number,

    photos: [String],

    rawData: Object,

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model(
  "GooglePlaceCache",
  googlePlaceCacheSchema
);