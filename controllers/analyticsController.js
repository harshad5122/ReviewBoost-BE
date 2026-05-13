const Analytics = require("../models/Analytics");
const Business = require("../models/Business");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// Track analytics event
exports.trackEvent = async (req, res) => {
  try {
    const { eventType, businessId, slug, userAgent, ipAddress } = req.body;

    // Create analytics record
    const analytics = new Analytics({
      eventType,
      businessId,
      slug,
      userAgent: userAgent || req.get("user-agent"),
      ipAddress: ipAddress || req.ip,
      timestamp: new Date(),
    });

    await analytics.save();

    // Update business scan count if QR scan
    if (eventType === "qr_scan" && businessId) {
      await Business.findByIdAndUpdate(
        businessId,
        { $inc: { qrScans: 1 } },
        { new: true }
      );
    }

    return sendSuccess(res, { tracked: true }, "Event tracked", 201);
  } catch (error) {
    console.error("Track event error:", error);
    // Don't fail request if tracking fails
    return sendSuccess(res, { tracked: false });
  }
};

// Get business analytics
exports.getBusinessAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { businessId } = req.params;
    const { startDate, endDate } = req.query;

    // Get business
    const business = await Business.findOne({
      _id: businessId,
      createdBy: userId,
    });

    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    // Build query
    const query = { businessId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get analytics
    const analytics = await Analytics.find(query).sort({ timestamp: -1 });

    // Calculate metrics
    const qrScans = analytics.filter((a) => a.eventType === "qr_scan").length;
    const pageViews = analytics.filter(
      (a) => a.eventType === "page_view"
    ).length;
    const reviewsGenerated = analytics.filter(
      (a) => a.eventType === "review_generated"
    ).length;
    const conversions = analytics.filter(
      (a) => a.eventType === "google_redirect"
    ).length;
    const conversionRate =
      pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(2) : 0;

    return sendSuccess(res, {
      business,
      metrics: {
        qrScans,
        pageViews,
        reviewsGenerated,
        conversions,
        conversionRate,
      },
      analytics,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return sendError(res, error.message || "Failed to get analytics", 500);
  }
};

// Get user's total analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all user's businesses
    const businesses = await Business.find({ createdBy: userId });
    const businessIds = businesses.map((b) => b._id);

    // Get all analytics for these businesses
    const analytics = await Analytics.find({
      businessId: { $in: businessIds },
    });

    // Calculate aggregate metrics
    const totalQrScans = analytics.filter(
      (a) => a.eventType === "qr_scan"
    ).length;
    const totalPageViews = analytics.filter(
      (a) => a.eventType === "page_view"
    ).length;
    const totalReviews = analytics.filter(
      (a) => a.eventType === "review_generated"
    ).length;
    const totalConversions = analytics.filter(
      (a) => a.eventType === "google_redirect"
    ).length;
    const conversionRate =
      totalPageViews > 0
        ? ((totalConversions / totalPageViews) * 100).toFixed(2)
        : 0;

    return sendSuccess(res, {
      totalBusinesses: businesses.length,
      metrics: {
        totalQrScans,
        totalPageViews,
        totalReviews,
        totalConversions,
        conversionRate,
      },
    });
  } catch (error) {
    console.error("Get user analytics error:", error);
    return sendError(
      res,
      error.message || "Failed to get user analytics",
      500
    );
  }
};

// Get aggregated analytics by date
exports.getAggregatedAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { businessId } = req.params;
    const { days = 7 } = req.query;

    // Get business
    const business = await Business.findOne({
      _id: businessId,
      createdBy: userId,
    });

    if (!business) {
      return sendError(res, "Business not found", 404);
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Get analytics for the date range
    const analytics = await Analytics.find({
      businessId,
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });

    // Aggregate by date
    const aggregated = {};
    analytics.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split("T")[0];

      if (!aggregated[date]) {
        aggregated[date] = {
          date,
          scans: 0,
          reviews: 0,
          conversions: 0,
          pageViews: 0,
        };
      }

      if (event.eventType === "qr_scan") aggregated[date].scans++;
      if (event.eventType === "review_generated") aggregated[date].reviews++;
      if (event.eventType === "google_redirect") aggregated[date].conversions++;
      if (event.eventType === "page_view") aggregated[date].pageViews++;
    });

    const chartData = Object.values(aggregated).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return sendSuccess(res, {
      chartData,
      summary: {
        totalScans: analytics.filter((a) => a.eventType === "qr_scan").length,
        totalPageViews: analytics.filter((a) => a.eventType === "page_view").length,
        totalReviews: analytics.filter((a) => a.eventType === "review_generated").length,
        totalConversions: analytics.filter((a) => a.eventType === "google_redirect").length,
      },
    });
  } catch (error) {
    console.error("Get aggregated analytics error:", error);
    return sendError(
      res,
      error.message || "Failed to get aggregated analytics",
      500
    );
  }
};
