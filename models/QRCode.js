const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    qrCodeData: {
      type: String,
      required: true,
    },

    qrCodeUrl: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      enum: ["png", "svg", "pdf"],
      default: "png",
    },

    size: {
      type: Number,
      default: 300,
    },

    errorCorrection: {
      type: String,
      enum: ["L", "M", "Q", "H"],
      default: "M",
    },

    downloadCount: {
      type: Number,
      default: 0,
    },

    scanCount: {
      type: Number,
      default: 0,
    },

    scans: [
      {
        scannedAt: {
          type: Date,
          default: Date.now,
        },
        userAgent: String,
        ipAddress: String,
        deviceType: String,
        country: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
qrCodeSchema.index({ businessId: 1 });
qrCodeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("QRCode", qrCodeSchema);
