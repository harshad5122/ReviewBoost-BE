const Business = require("../models/Business");
const Review = require("../models/Review");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateReviewInput } = require("../utils/validators");
const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate review with AI
exports.generateReview = async (req, res) => {
  try {
    const { businessId, feedback } = req.body;

    // Validation
    const validation = validateReviewInput({ businessId, feedback });
    if (!validation.valid) {
      return sendError(res, validation.errors.join(", "), 400);
    }

    // Get business
    const business = await Business.findById(businessId);
    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    // Generate review using GROQ
    const prompt = `
You are an expert at writing professional and polished Google reviews. 
Based on the following customer feedback, write a professional Google review (2-3 sentences) that:
- Sounds natural and authentic
- Highlights the main point of the feedback
- Is positive but honest
- Suitable for Google reviews

Customer Business: ${business.businessName}
Customer Category: ${business.category || "service"}
Customer Feedback: ${feedback}

Write ONLY the review text, nothing else. Do not include quotes or extra formatting.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,

      max_tokens: 150,
    });

    const generatedReview =
      completion.choices?.[0]?.message?.content?.trim() || "";

    const review = new Review({
      businessId,
      feedback,
      generatedReview,
      source: "api",
    });

    await review.save();

    business.totalRatings = (business.totalRatings || 0) + 1;

    await business.save();

    return sendSuccess(
      res,
      {
        review: generatedReview,
        reviewId: review._id,
      },
      "Review generated successfully",
    );
  } catch (error) {
    console.error("Generate review error:", error);
    return sendError(res, error.message || "Failed to generate review", 500);
  }
};

// Get review details by slug
exports.getReviewPage = async (req, res) => {
  try {
    const { slug } = req.params;

    const business = await Business.findOne({ slug });
    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    return sendSuccess(res, business);
  } catch (error) {
    console.error("Get review page error:", error);
    return sendError(res, error.message || "Failed to get review page", 500);
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.userId;

    const reviews = await Review.find()
      .populate({
        path: "businessId",
        match: { createdBy: userId },
      })
      .sort({ createdAt: -1 });

    const filteredReviews = reviews.filter((r) => r.businessId);

    return sendSuccess(res, filteredReviews);
  } catch (error) {
    console.error("Get user reviews error:", error);
    return sendError(res, error.message || "Failed to get reviews", 500);
  }
};
