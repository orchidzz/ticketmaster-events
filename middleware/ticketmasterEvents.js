require("dotenv").config();
const axios = require("axios");
const geofire = require("geofire-common");
const Event = require("./../models/event");

/** Query events from ticketmaster api
 * @param longitude float
 * @param latitude float
 * @param date string of string date for events (format: YYYY-MM-DDTHH:mm:ssZ)
 * @param keywords array of string keywords for events
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
                sort: "distance,asc",
                apikey: process.env.TICKETMASTER_API_KEY,
            },
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
            if ("start" in e) {
                if ("localDate" in e.start) {
                    event.date = e.start.localDate;
                }
                if ("localTime" in e.start) {
                    event.time = e.start.localTime;
                }
            }
            if ("priceRanges" in e) {
                if ("currency" in e.priceRanges) {
                    event.currency = e.priceRanges.currency;
                }
                if ("min" in e.priceRanges) {
                    event.minPrice = e.priceRanges.min;
                }
                if ("max" in e.priceRanges) {
                    event.maxPrice = e.priceRanges.max;
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
        console.log("Error with getting events from Ticketmaster: ", error);
    }
}

module.exports = getTicketmasterEvents;
