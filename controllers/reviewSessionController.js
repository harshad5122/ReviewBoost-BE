const ReviewSession =
  require(
    "../models/ReviewSession"
  );

exports.createReviewSession =
  async (req, res) => {

    try {

      const {
        businessId,
        rating,
      } = req.body;

      let deviceType =
        "Desktop";

      const userAgent =
        req.headers[
          "user-agent"
        ] || "";

      if (
        /mobile/i.test(
          userAgent
        )
      ) {

        deviceType =
          "Mobile";

      }

      const session =
        await ReviewSession.create(
          {
            businessId,

            rating,

            ipAddress:
              req.ip,

            deviceType,
          }
        );

      res.status(201).json({
        success: true,

        session,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

exports.markRedirectedToGoogle =
  async (req, res) => {

    try {

      const {
        sessionId,
      } = req.body;

      await ReviewSession.findByIdAndUpdate(
        sessionId,

        {
          redirectedToGoogle:
            true,
        },

        {
          returnDocument:
            "after",
        }
      );

      res.status(200).json({
        success: true,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };