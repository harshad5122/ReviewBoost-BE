const {
  searchBusinesses,
  getPlaceDetails,
} = require(
  "../services/googlePlacesService"
);

exports.searchPlaces =
  async (req, res) => {

    try {

      const { query } =
        req.query;

      if (!query) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Query required",
          });

      }

      const businesses =
        await searchBusinesses(
          query
        );

      res.status(200).json({
        success: true,
        businesses,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

exports.getPlaceDetailsController =
  async (req, res) => {

    try {

      const {
        placeId,
      } = req.params;

      const details =
        await getPlaceDetails(
          placeId
        );

      res.status(200).json({
        success: true,
        details,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };