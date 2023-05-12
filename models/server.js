const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors()); // enable CORS
    }

    // bind controllers to routes
    routes() {
        // this.app.use(this.paths.login, require("../routes/login"));
        // connect to frontend --> one page
        this.app.use(express.static(path.join(__dirname, "../static")));
        this.app.get("/", (req, res) => {
            res.sendFile(__dirname + "/index.html");
        });
        // get routes
        this.app.get("/events", require("../controllers/getEvents").getEvents);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port: ", this.port);
        });
    }
}

module.exports = Server;