'use strict';

const SwaggerExpress = require('swagger-express-mw');
const cors = require('cors');
const SwaggerUi = require('swagger-tools/middleware/swagger-ui');
const db = require('./api/models/index');
const express = require('express');
const multer = require('multer');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const debug = require("debug")("ndb:swc-service:models");

app.locals.dbready = false;

io.on('connection', function (socket) {
    broadcastAll();
});

module.exports.app = app; // for testing
module.exports.broadcast = broadcastAll;

const config = {
    appRoot: __dirname  // required config
};

app.use('/script/socket.io', express.static(__dirname + '/node_modules/socket.io-client'));

const upload = multer({dest: 'uploads/'})
app.use(upload.single('contents'));

SwaggerExpress.create(config, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }

    //app.user

    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);

    const port = process.env.PORT || 9651;

    http.listen(port);
});

sync();

function sync() {
    db.sequelize.authenticate().then(() => {
        app.locals.dbready = true;

        //db.StructureIdentifier.populateDefault().then(function () {
            broadcastAll();
        //    debug('successful database sync.');
        //});
    }).catch((err) => {
        debug('failed database sync.');
        debug(err);
        setTimeout(sync, 5000);
    });
}

function broadcastAll() {
    io.emit('db_status', app.locals.dbready);

    if (app.locals.dbready) {
        db.Tracing.count().then((val) => {
            io.emit('tracingCount', val);
        });
        db.TracingNode.count().then((val) => {
            io.emit('tracingNodeCount', val);
        });
        db.StructureIdentifier.count().then((val) => {
            io.emit('structureIdentifierCount', val);
        });
    } else {
        io.emit('tracingCount', -1);
        io.emit('tracingNodeCount', -1);
        io.emit('markerLocationCount', -1);
        io.emit('structureIdentifierCount', -1);
    }
}
