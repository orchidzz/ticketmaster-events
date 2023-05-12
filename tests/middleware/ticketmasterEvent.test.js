const getTicketmasterEvents = require("./../../middleware/ticketmasterEvents");

test("get existing events", async () => {
    data = await getTicketmasterEvents(
        34.0218833,
        -118.28586662125,
        "2023-06-01T17:00:00Z",
        ["music"]
    );
    expect(data.length).toBeGreaterThan(0);
});

test("get no event", async () => {
    data = await getTicketmasterEvents(
        64.44595098,
        -149.68088865,
        "2023-06-01T17:00:00Z",
        ["cooking", "anime"]
    );
    expect(data.length).toBe(0);
});
