const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["qr_scan", "page_view", "review_generated", "google_redirect", "review_copied", "copy_review", "post_google"],
      required: true,
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },

    slug: String,

    userAgent: String,

    ipAddress: String,

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
analyticsSchema.index({ businessId: 1, timestamp: -1 });
analyticsSchema.index({ slug: 1, timestamp: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
