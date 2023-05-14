const geocode = require("./../middleware/geocode");
const getTicketmasterEvents = require("./../middleware/ticketmasterEvents");

async function getEvents(req, res) {
    // call geocoding api
    geoPoint = await geocode(req.query.location);
    // if location does not exist, return null as response
    if (!geoPoint) {
        res.json(null);
    }
    // call ticketmaster api
    events = await getTicketmasterEvents(
        geoPoint[0],
        geoPoint[1],
        req.query.date,
        req.query.keywords
    );
    if (events.length == 0) {
        events = null;
    }
    // serialize arr of event objects and send back as response
    res.json(events);
}

module.exports = getEvents;
