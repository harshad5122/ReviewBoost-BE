const slugify = require(
  "slugify"
);

const Business = require(
  "../models/Business"
);

const GooglePlaceCache =
  require(
    "../models/GooglePlaceCache"
  );

exports.createBusinessFromPlace =
  async (req, res) => {

    try {

      const { placeId } =
        req.body;

      if (!placeId) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Place ID required",
          });

      }

      // CHECK CACHE

      const place =
        await GooglePlaceCache.findOne(
          {
            placeId,
          }
        );

      if (!place) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Place data not found in cache",
          });

      }

      // CHECK BUSINESS ALREADY EXISTS

      const existingBusiness =
        await Business.findOne({
          placeId,
        });

      if (existingBusiness) {

        return res
          .status(400)
          .json({
            success: false,
            message:
              "Business already exists",
          });

      }

      // CREATE SLUG

      const slug = slugify(
        place.businessName,
        {
          lower: true,
          strict: true,
        }
      );

      // CREATE REVIEW URL

      const googleReviewUrl =
        `https://search.google.com/local/writereview?placeid=${placeId}`;

      // CREATE BUSINESS

      const business =
        await Business.create({
          businessName:
            place.businessName,

          slug,

          category:
            place.category,

          city:
            place.formattedAddress,

          googleReviewUrl,

          placeId,

          rating:
            place.rating,

          totalRatings:
            place.totalRatings,

          address:
            place.formattedAddress,

          phoneNumber:
            place.phoneNumber,

          website:
            place.website,

          googleMapsUrl:
            place.googleMapsUrl,

          latitude:
            place.latitude,

          longitude:
            place.longitude,

          photos:
            place.photos,

          createdBy:
            req.user.id,
        });

      res.status(201).json({
        success: true,
        business,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };