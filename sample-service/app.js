"use strict";

const SwaggerExpress = require("swagger-express-mw");
const SwaggerUi = require("swagger-tools/middleware/swagger-ui");

const express = require("express");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const logger = require("morgan");

const db = require("./api/models/index");

const app = express();

const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server);

const debug = require("debug")("ndb:sample-service:server");

app.locals.dbready = false;

io.on("connection", () => {
    broadcastAll();
});

module.exports.app = app; // for testing
module.exports.broadcast = broadcastAll;

const config = {
    appRoot: __dirname  // required config
};

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(compress());
app.use(methodOverride());

app.use("/script/socket.io", express.static(__dirname + "/node_modules/socket.io-client"));

SwaggerExpress.create(config, (err, swaggerExpress) => {
    if (err) {
        throw err;
    }

    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);

    const port = process.env.PORT || 9641;

    server.listen(port);
});

sync();

function sync() {
    syncDatabase().then(() => {
        return broadcastAll();
    }).then(() => {
        debug("successful database sync");
    }).catch((err) => {
        debug("failed database sync");
        debug(err);
        setTimeout(sync, 5000);
    });
}

function syncDatabase() {
    return new Promise((resolve, reject) => {
        db.sequelize.authenticate().then(() => {
            app.locals.dbready = true;
            resolve(db);
        }).catch((err) => {
            reject(err);
        })
    });
}

function broadcastAll() {
    return new Promise((resolve) => {
        io.emit("db_status", app.locals.dbready);

        if (app.locals.dbready) {
            db.Sample.count().then(function (val) {
                io.emit("sampleCount", val);
            });
            db.MouseStrain.count().then(function (val) {
                io.emit("mouseStrainCount", val);
            });
            db.RegistrationTransform.count().then(function (val) {
                io.emit("registrationTransformCount", val);
            });

            db.Injection.count().then(function (val) {
                io.emit("injectionCount", val);
            });
            db.InjectionVirus.count().then(function (val) {
                io.emit("injectionVirusCount", val);
            });
            db.Fluorophore.count().then(function (val) {
                io.emit("fluorophoreCount", val);
            });

            db.Neuron.count().then(function (val) {
                io.emit("neuronCount", val);
            });
            db.BrainArea.count().then(function (val) {
                io.emit("brainAreaCount", val);
            });
            resolve(true);
        } else {
            io.emit("sampleCount", -1);
            io.emit("mouseStrainCount", -1);
            io.emit("registrationTransformCount", -1);
            io.emit("injectionCount", -1);
            io.emit("injectionVirusCount", -1);
            io.emit("fluorophoreCount", -1);
            io.emit("neuronCount", -1);
            io.emit("brainAreaCount", -1);
            resolve(false);
        }
    });
};
