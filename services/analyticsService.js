const Analytics = require(
  "../models/Analytics"
);

const trackEvent = async ({
  businessId,
  eventType,
  req,
  metadata = {},
}) => {

  try {

    let deviceType = "Desktop";

    const userAgent =
      req.headers["user-agent"] || "";

    if (
      /mobile/i.test(userAgent)
    ) {
      deviceType = "Mobile";
    }

    await Analytics.create({
      businessId,
      eventType,
      ipAddress: req.ip,
      userAgent,
      deviceType,
      metadata,
    });

  } catch (error) {

    console.log(
      "Analytics Error:",
      error.message
    );

  }
};

module.exports = trackEvent;