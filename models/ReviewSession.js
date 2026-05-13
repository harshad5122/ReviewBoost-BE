const mongoose =
  require("mongoose");

const reviewSessionSchema =
  new mongoose.Schema(
    {
      businessId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Business",
      },

      rating:
        Number,

      service:
        String,

      generatedReview:
        String,

      redirectedToGoogle: {
        type: Boolean,
        default: false,
      },

      completed: {
        type: Boolean,
        default: false,
      },

      ipAddress:
        String,

      deviceType:
        String,

      createdAt: {
        type: Date,
        default:
          Date.now,
      },
    }
  );

module.exports =
  mongoose.model(
    "ReviewSession",
    reviewSessionSchema
  );