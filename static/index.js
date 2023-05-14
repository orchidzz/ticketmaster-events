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
        // hide error display and page navigation if search is attempted again
        $("#error").css("display", "none");
        $("#page-nav").css("display", "none");

        req_location = $("#location").val();
        req_date = $("#date").val();
        req_keywords = $("#keywords").val();
        // deal with empty inputs
        if (req_location == "") {
            req_location = "Los Angeles, CA"; // default location
        }
        $("#events-container").empty();
        $("#loading").css("display", "initial");
        $.ajax({
            url: "/events",
            contentType: "application/json",
            type: "GET",
            data: {
                location: req_location,
                date: req_date + "T00:00:01Z", // correct format of date time for query
                keywords: req_keywords,
            },
            complete: function () {
                $("#loading").css("display", "none");
            },
            success: function (response) {
                if (response != null) {
                    // store response into cache
                    sessionStorage.setItem("events", JSON.stringify(response));
                    sessionStorage.setItem("idx", "-20");
                    generateCards(true);
                    $("#page-nav").css("display", "initial");
                } else {
                    // show some warning/error
                    $("#error").css("display", "flex");
                    $("#page-nav").css("display", "none");
                }
            },
            error: function (error) {
                console.log("error getting events: ", error);
                $("#error").css("display", "flex");
                $("#page-nav").css("display", "none");
            },
        });
    });
    $("#next").on("click", function () {
        generateCards(true);
    });
    $("#prev").on("click", function () {
        generateCards(false);
    });
});

/**
 * Generate card components for <= 20 events stored in sessionStorage
 * @param {boolean} next keep track of whether next button was clicked or not
 */
function generateCards(next) {
    // reset next and prev btns
    $("#next-item").css("display", "initial");
    $("#prev-item").css("display", "initial");

    let start = parseInt(sessionStorage.getItem("idx"));
    let events = JSON.parse(sessionStorage.getItem("events"));
    console.log(start);
    if (next) {
        if (start + 20 < events.length) {
            sessionStorage.setItem("idx", start + 20);
            $("#next-item").css("display", "initial");
        }
    } else {
        if (start - 20 >= 0) {
            sessionStorage.setItem("idx", start - 20);
            $("#prev-item").css("display", "initial");
        }
    }
    // clear all cards first
    $("#events-container").empty();
    start = parseInt(sessionStorage.getItem("idx"));
    console.log(start);

    // disable next btn on last page
    if (start + 20 >= events.length) {
        $("#next-item").css("display", "none");
    }
    // disable prev btn on first page
    if (start - 20 < 0) {
        $("#prev-item").css("display", "none");
    }

    for (i = start; i < Math.min(start + 20, events.length); ++i) {
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
