const mongoose = require("mongoose");
const slugify = require("slugify");
const { validateUrl } = require("../utils/validators");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: [200, "Business name cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    googleReviewUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validateUrl(v);
        },
        message: "Invalid Google Review URL",
      },
    },

    placeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    description: {
      type: String,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    logo: {
      type: String,
      default: "",
    },

    qrCodeUrl: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },

    address: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;

          return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
            v.replace(/\s/g, ""),
          );
        },

        message: "Invalid phone number format",
      },
    },

    website: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validateUrl(v);
        },

        message: "Invalid website URL",
      },
    },

    googleMapsUrl: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,

      validate: {
        validator: function (v) {
          return v == null || (v >= -90 && v <= 90);
        },

        message: "Invalid latitude coordinate",
      },
    },

    longitude: {
      type: Number,

      validate: {
        validator: function (v) {
          return v == null || (v >= -180 && v <= 180);
        },

        message: "Invalid longitude coordinate",
      },
    },

    photos: {
      type: [String],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Generate slug from business name
 */
businessSchema.pre("save", async function () {
  if (this.isModified("businessName") || !this.slug) {
    let baseSlug = slugify(this.businessName, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;

    let counter = 1;

    while (true) {
      const existingBusiness = await mongoose.model("Business").findOne({
        slug,
        _id: {
          $ne: this._id,
        },
      });

      if (!existingBusiness) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
});

/**
 * Virtual review page URL
 */
businessSchema.virtual("reviewPageUrl").get(function () {
  return `${process.env.CLIENT_URL}/r/${this.slug}`;
});

/**
 * Ensure virtuals are included
 */
businessSchema.set("toJSON", {
  virtuals: true,
});

businessSchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model("Business", businessSchema);
