const GooglePlaceCache = require("../models/GooglePlaceCache");

const searchBusinesses = async (query) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query,
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    return data.results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPlaceDetails = async (placeId) => {
  try {
    // CHECK CACHE FIRST

    const cachedPlace = await GooglePlaceCache.findOne({
      placeId,
    });

    if (cachedPlace) {
      const daysOld =
        (Date.now() - new Date(cachedPlace.updatedAt).getTime()) /
        (1000 * 60 * 60 * 24);

      // 30 DAYS CACHE

      if (daysOld < 30) {
        console.log("Returning Cached Data");

        return cachedPlace;
      }
    }

    // GOOGLE API CALL

    console.log("Calling Google API");

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    const place = data.result;

    const cacheData = {
      placeId,

      businessName: place.name,

      formattedAddress: place.formatted_address,

      category: place.types?.[0] || "",

      rating: place.rating,

      totalRatings: place.user_ratings_total,

      phoneNumber: place.formatted_phone_number,

      website: place.website,

      latitude: place.geometry?.location?.lat,

      longitude: place.geometry?.location?.lng,

      photos:
        place.photos?.map(
          (photo) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        ) || [],

      googleMapsUrl: place.url,

      rawData: place,

      updatedAt: new Date(),
    };

    // SAVE CACHE

    await GooglePlaceCache.findOneAndUpdate(
      { placeId },

      cacheData,

      {
        upsert: true,
        returnDocument: "after",
      },
    );

    return cacheData;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  searchBusinesses,
  getPlaceDetails,
};
