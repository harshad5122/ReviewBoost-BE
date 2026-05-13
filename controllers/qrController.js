const Business = require(
  "../models/Business"
);

const generateQRCode =
  require(
    "../services/qrService"
  );

exports.generateBusinessQR =
  async (req, res) => {

    try {

      const {
        businessId,
      } = req.body;

      const business =
        await Business.findById(
          businessId
        );

      if (!business) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Business not found",
          });

      }

      // PUBLIC REVIEW URL

      const googleReviewUrl =
        `${process.env.FRONTEND_URL}/r/${business.slug}`;

      // GENERATE QR

      const qrCode =
        await generateQRCode(
          googleReviewUrl
        );

      // SAVE QR

      business.qrCodeUrl =
        qrCode;

      await business.save();

      res.status(200).json({
        success: true,

        qrCode,

        googleReviewUrl,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };