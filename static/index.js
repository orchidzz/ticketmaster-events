$("document").ready(function () {
    $("#control-btn").on("click", function () {
        $("#collapse-control").toggle();
    });

    // get current date
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, "0");
    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    let currentYear = date.getFullYear();
    let currentDate =
        currentYear.toString() +
        "-" +
        currentMonth.toString() +
        "-" +
        currentDay.toString();
    // disable dates earlier than current date
    $("#date").attr("min", currentDate);
    $("#date").attr("value", currentDate);

    $("#search-btn").on("click", function () {
        req_location = $("#location").val();
        req_date = $("#date").val();
        req_keywords = $("#keywords").val();
        console.log(req_location);
        console.log(req_keywords);
        console.log(req_date);

        $.ajax({
            url: "/events",
            contentType: "application/json",
            type: "GET",
            data: {
                location: req_location,
                date: req_date + "T00:00:01Z",
                keywords: req_keywords,
            },
            success: function (response) {
                if (response != null) {
                    // store response into cache
                    sessionStorage.setItem("events", JSON.stringify(response));
                    sessionStorage.setItem("idx", "0");
                    generateCards(true);
                } else {
                    // hide the card or show some warning/error
                }
            },
            error: function (error) {
                console.log("error getting events: ", error);
            },
        });
    });
    $("#next").on("click", function () {
        console.log("next");
        generateCards(true);
    });
    $("#prev").on("click", function () {
        generateCards(false);
    });
});

function generateCards(next) {
    let start = parseInt(sessionStorage.getItem("idx"));
    if (next) {
        if (start + 20 < 100) {
            sessionStorage.setItem("idx", start + 20);
        } else {
            //disable next
            $("next").addClass("disabled");
            return;
        }
    } else {
        if (start - 20 >= 0) {
            sessionStorage.setItem("idx", start - 20);
        } else {
            //disable next
            $("prev").addClass("disabled");
            return;
        }
    }
    // clear all cards first
    $("events-container").empty();
    start = parseInt(sessionStorage.getItem("idx"));
    let events = JSON.parse(sessionStorage.getItem("events"));
    for (i = start; i < start + 20; ++i) {
        $("#events-container").append(
            $("<div/>")
                .addClass("card")
                .append(
                    $("<img/>")
                        .addClass("card-img-top")
                        .attr("src", events[i].imgUrl)
                )
                .append(
                    $("<div/>")
                        .addClass("card-body")
                        .append(
                            $("<h5/>")
                                .addClass("card-title")
                                .text(events[i].name)
                        )
                        .append(
                            $("<h6/>")
                                .addClass("card-subtitle mb-2 text-muted")
                                .text(
                                    events[i].location +
                                        " " +
                                        events[i].currency +
                                        events[i].minPrice +
                                        "-" +
                                        events[i].currency +
                                        events[i].maxPrice
                                )
                        )
                        .append(
                            $("<h6/>")
                                .addClass("card-subtitle mb-2 text-muted")
                                .text(events[i].date + " " + events[i].time)
                        )
                        .append(
                            $("<p/>")
                                .addClass("card-text")
                                .text(events[i].descrpition)
                        )
                )
        );
    }
}
