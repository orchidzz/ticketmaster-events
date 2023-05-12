require("dotenv").config();
const axios = require("axios");

/** Convert location to longitude and latitude
 * @param location: string of location/address
 * @return: array of longitude and latitude
 * */
export default async function geocode(location) {
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
        result = response.data.features[0].properties;
        return [result.lon, result.lat];
    } catch (error) {
        console.log("Error with geocoding address: ", error);
    }
}
