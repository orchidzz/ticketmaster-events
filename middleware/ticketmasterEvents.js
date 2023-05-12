require("dotenv").config();
const axios = require("axios");

/** Query events from ticketmaster api
 * @param longitude: float of location
 * @param latitude: float of location
 * @param date: string of date for events
 * @param keywords: array of keywords for events
 * @return: array of Event objects
 * note: do not call geocode() inside this func to make unit testing easier
 * */
// export default async function getTicketmasterEvents(req) {
//     try {
//         if (!process.env.TICKETMASTER_API_KEY) {
//             throw new Error("You forgot to set TICKETMASTER_API_KEY in your environment");
//         }
//         response = await axios({
//             url: "https://api.geoapify.com/v1/geocode/search",
//             method: "get",
//             params: {
//                 text: location,
//                 limit: 1,
//                 apiKey: process.env.TICKETMASTER_API_KEY,
//             },
//         });

//         return response.data.features[0].properties;
//     } catch (error) {
//         console.log("Error with getting events from Ticketmaster: ", error);
//     }
// }
