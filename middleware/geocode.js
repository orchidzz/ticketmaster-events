require("dotenv").config();
const axios = require("axios");

/** Convert location to longitude and latitude
 * @param location string of location/address
 * @returns array of latitude and longitude
 * */
async function geocode(location) {
    try {
        if (!process.env.GEOCODE_API_KEY) {
            throw new Error(
                "You forgot to set GEOCODE_API_KEY in your environment"
            );
        }
        response = await axios({
            url: "https://api.geoapify.com/v1/geocode/search",
            method: "get",
            params: {
                text: location,
                limit: 1,
                apiKey: process.env.GEOCODE_API_KEY,
            },
        });
        if (response.data.features.length > 0) {
            var result = response.data.features[0].properties;
            return [result.lat, result.lon];
        } else {
            return null;
        }
    } catch (error) {
        console.log("Error with geocoding address: ", error);
    }
}

module.exports = geocode;
