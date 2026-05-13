const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    feedback: {
      type: String,
      required: true,
    },

    generatedReview: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      enum: ["api", "manual"],
      default: "api",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ businessId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
