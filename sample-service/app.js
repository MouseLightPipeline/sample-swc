'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');

var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var logger = require('morgan');

var db = require('./api/models/index');

var app = express();

var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

app.locals.dbready = false;

io.on('connection', function () {
    broadcastAll();
});

module.exports.app = app; // for testing
module.exports.broadcast = broadcastAll;

var config = {
    appRoot: __dirname  // required config
};

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(compress());
app.use(methodOverride());

app.use('/script/socket.io', express.static(__dirname + '/node_modules/socket.io-client'));

SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }

    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 9641;

    server.listen(port);
});

sync();

function sync() {
    syncDatabase().then(() => {
        return db.InjectionVirus.populateDefault();
    }).then((didPopulate) => {
        if (didPopulate) {
            console.log("Populated injection viruses with defaults.");
        }
        return db.MouseStrain.populateDefault();
    }).then((didPopulate) => {
        if (didPopulate) {
            console.log("Populated mouse strains with defaults.");
        }
        return db.Fluorophore.populateDefault();
    }).then((didPopulate) => {
        if (didPopulate) {
            console.log("Populated fluorophores with defaults.");
        }
        return db.BrainArea.populateDefault();
    }).then((didPopulate) => {
        if (didPopulate) {
            console.log("Populated brain areas with defaults.");
        }
        return broadcastAll();
    }).then(() => {
        console.log("Successful database sync");
    }).catch((err) => {
        console.log('Failed database sync: ');
        console.log(err);
        setTimeout(sync, 5000);
    });
};

function syncDatabase() {
    return new Promise((resolve, reject) => {
        db.sequelize.sync().then(() => {
            app.locals.dbready = true;
            resolve(db);
        }).catch((err) => {
            reject(err);
        })
    });
}

function broadcastAll() {
    return new Promise((resolve) => {
        io.emit('db_status', app.locals.dbready);

        if (app.locals.dbready) {
            db.Sample.count().then(function (val) {
                io.emit('sampleCount', val);
            });
            db.MouseStrain.count().then(function (val) {
                io.emit('mouseStrainCount', val);
            });
            db.RegistrationTransform.count().then(function (val) {
                io.emit('registrationTransformCount', val);
            });

            db.Injection.count().then(function (val) {
                io.emit('injectionCount', val);
            });
            db.InjectionVirus.count().then(function (val) {
                io.emit('injectionVirusCount', val);
            });
            db.Fluorophore.count().then(function (val) {
                io.emit('fluorophoreCount', val);
            });

            db.Neuron.count().then(function (val) {
                io.emit('neuronCount', val);
            });
            db.BrainArea.count().then(function (val) {
                io.emit('brainAreaCount', val);
            });
            resolve(true);
        } else {
            io.emit('sampleCount', -1);
            io.emit('mouseStrainCount', -1);
            io.emit('registrationTransformCount', -1);
            io.emit('injectionCount', -1);
            io.emit('injectionVirusCount', -1);
            io.emit('fluorophoreCount', -1);
            io.emit('neuronCount', -1);
            io.emit('brainAreaCount', -1);
            resolve(false);
        }
    });
};
