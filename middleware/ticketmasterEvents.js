require("dotenv").config();
const axios = require("axios");
const geofire = require("geofire-common");
const Event = require("./../models/event");

/** Query events from ticketmaster api
 * @param {float} longitude
 * @param {float} latitude
 * @param {string} date of events (format: YYYY-MM-DDTHH:mm:ssZ)
 * @param keywords keywords to search for events
 * @returns array of Event objects
 * @note use lon, lat params so do not call geocode() inside this func to make unit testing easier
 * */
async function getTicketmasterEvents(latitude, longitude, date, keywords) {
    try {
        if (!process.env.TICKETMASTER_API_KEY) {
            throw new Error(
                "You forgot to set TICKETMASTER_API_KEY in your environment"
            );
        }
        response = await axios({
            url: "https://app.ticketmaster.com/discovery/v2/events",
            method: "get",
            dataType: "json",
            params: {
                startDateTime: date,
                keyword: keywords.toString(),
                geoPoint: geofire.geohashForLocation([latitude, longitude], 9),
                size: "100",
                sort: "distance,date,asc",
                apikey: process.env.TICKETMASTER_API_KEY,
            },
        }).catch(() => {
            throw new Error("Error with getting events from Ticketmaster");
        });
        var result = new Array();
        if (!("_embedded" in response.data)) {
            return result;
        }
        events = response.data._embedded.events; // arr of events
        events.forEach((e) => {
            // create new Event object using e.properties
            var event = new Event();
            event.name = e.name;
            event.description = e.description;
            event.url = e.url;
            // ensure that these keys exist in the e object
            if ("images" in e) {
                event.imgUrl = e.images[0].url; // get first image
            }
            if ("dates" in e) {
                if ("start" in e.dates) {
                    if ("localDate" in e.dates.start) {
                        event.date = e.dates.start.localDate;
                    }
                    if ("localTime" in e.dates.start) {
                        event.time = e.dates.start.localTime;
                    }
                }
            }
            if ("priceRanges" in e) {
                // get the first price range
                if ("currency" in e.priceRanges[0]) {
                    event.currency = e.priceRanges[0].currency;
                }
                if ("min" in e.priceRanges[0]) {
                    event.minPrice = e.priceRanges[0].min;
                }
                if ("max" in e.priceRanges[0]) {
                    event.maxPrice = e.priceRanges[0].max;
                }
            }
            if ("venues" in e._embedded) {
                event.location = e._embedded.venues[0].name; // get the first venue
            }

            // append to result arr
            result.push(event);
        });
        return result;
    } catch (error) {
        console.log("Error with getting events: ", error);
    }
}

module.exports = getTicketmasterEvents;
