const geocode = require("./../../middleware/geocode");

test("geocode exact location", () => {
    return geocode("3551 Trousdale Pkwy. Los Angeles, CA 90089").then(
        (data) => {
            expect(data).toEqual([34.020663, -118.285311]);
        }
    );
});

test("geocode location by name", async () => {
    const data = await geocode("University of Southern California");
    expect(data).toEqual([34.0218833, -118.28586662125]);
    const data2 = await geocode("UCLA");
    expect(data2).toEqual([34.070877749999994, -118.44685070595054]);
});

test("geocode location by city", async () => {
    const data = await geocode("Los Angeles");
    expect(data).toEqual([34.0536909, -118.242766]);
    const data2 = await geocode("New York City");
    expect(data2).toEqual([40.7127281, -74.0060152]);
});

test("geocode non-existing location", async () => {
    const data = await geocode("Hogwards");
    expect(data).toBeNull();
    const data2 = await geocode("lalala, usa");
    expect(data2).toBeNull();
});
