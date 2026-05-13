const Business = require("../models/Business");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateBusinessInput } = require("../utils/validators");
const slugify = require("slugify");

// Create business
exports.createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      category,
      city,
      description,
      website,
      phoneNumber,
      address,
      googleReviewUrl,
      placeId,
    } = req.body;
    const userId = req.userId;

    // Validation
    const validation = validateBusinessInput({ businessName });
    if (!validation.valid) {
      return sendError(res, validation.errors.join(", "), 400);
    }

    // Check if business already exists for this user
    const existingBusiness = await Business.findOne({
      businessName,
      createdBy: userId,
    });

    if (existingBusiness) {
      return sendError(res, "Business already exists", 409);
    }

    // Generate slug
    let slug = slugify(businessName, { lower: true, strict: true });

    // Check if slug is unique
    let existingSlug = await Business.findOne({ slug });
    let counter = 1;
    while (existingSlug) {
      slug = `${slugify(businessName, { lower: true, strict: true })}-${counter}`;
      existingSlug = await Business.findOne({ slug });
      counter++;
    }

    // Create business
    const business = new Business({
      businessName: businessName.trim(),
      slug,
      category: category?.trim(),
      city: city?.trim(),
      description: description?.trim(),
      website: website?.trim(),
      phoneNumber: phoneNumber?.trim(),
      address: address?.trim(),
      googleReviewUrl: googleReviewUrl?.trim(),
      placeId: placeId?.trim(),
      createdBy: userId,
    });

    await business.save();

    return sendSuccess(res, business, "Business created successfully", 201);
  } catch (error) {
    console.error("Create business error:", error);
    return sendError(res, error.message || "Failed to create business", 500);
  }
};

// Get all businesses for user
exports.getAllBusinesses = async (req, res) => {
  try {
    const userId = req.userId;

    const businesses = await Business.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return sendSuccess(res, businesses);
  } catch (error) {
    console.error("Get businesses error:", error);
    return sendError(res, error.message || "Failed to get businesses", 500);
  }
};

// Get single business
exports.getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const business = await Business.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    return sendSuccess(res, business);
  } catch (error) {
    console.error("Get business error:", error);
    return sendError(res, error.message || "Failed to get business", 500);
  }
};

// Get business by slug (public)
exports.getBusinessBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const business = await Business.findOne({ slug });

    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    return sendSuccess(res, business);
  } catch (error) {
    console.error("Get business by slug error:", error);
    return sendError(res, error.message || "Failed to get business", 500);
  }
};

// Update business
exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    // Only allow updating certain fields
    const allowedFields = [
      "businessName",
      "category",
      "city",
      "description",
      "website",
      "phoneNumber",
      "address",
      "googleReviewUrl",
      "placeId",
      "qrCodeUrl",
      "rating",
      "totalRatings",
    ];

    const filteredData = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const business = await Business.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    // Update fields
    Object.assign(business, filteredData);
    await business.save();

    return sendSuccess(res, business, "Business updated successfully");
  } catch (error) {
    console.error("Update business error:", error);
    return sendError(res, error.message || "Failed to update business", 500);
  }
};

// Delete business
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const business = await Business.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    return sendSuccess(res, null, "Business deleted successfully");
  } catch (error) {
    console.error("Delete business error:", error);
    return sendError(res, error.message || "Failed to delete business", 500);
  }
};

// Search businesses
exports.searchBusinesses = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.userId;

    if (!q || q.trim().length === 0) {
      return sendError(res, "Search query required", 400);
    }

    const businesses = await Business.find(
      {
        createdBy: userId,
        $or: [
          { businessName: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { city: { $regex: q, $options: "i" } },
        ],
      },
      null,
      { limit: 10 }
    );

    return sendSuccess(res, businesses);
  } catch (error) {
    console.error("Search businesses error:", error);
    return sendError(res, error.message || "Failed to search businesses", 500);
  }
};
