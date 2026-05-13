const QRCode = require("qrcode");

const generateQRCode =
  async (url) => {

    try {

      const qrImage =
        await QRCode.toDataURL(
          url,
          {
            width: 500,
            margin: 2,
          }
        );

      return qrImage;

    } catch (error) {

      throw new Error(
        error.message
      );

    }
  };

module.exports =
  generateQRCode;