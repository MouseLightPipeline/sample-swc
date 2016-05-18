'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var db = require('./api/models/index');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.locals.dbready = false;

io.on('connection', function(socket) {  
    broadcastAll();
});

module.exports.app = app; // for testing
module.exports.broadcast = broadcastAll;

var config = {
    appRoot: __dirname      // required config
};

app.use('/script/socket.io', express.static(__dirname + '/node_modules/socket.io-client'));

app.use(require('skipper')());

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);
  
    var port = process.env.PORT || 9641;
  
    http.listen(port);
});

sync();

function sync()
{
    db.sequelize.sync().then(function() {
        app.locals.dbready = true;
        db.StructureIdentifier.populateDefault().then(function() {
            db.InjectionLocation.populateDefault()
        }).then(function() {
            db.RegistrationTransform.populateDefault()
        }).then(function() {
            db.Virus.populateDefault(db)
        }).then(function() {
            db.BrainArea.populateDefault(db)
        }).then(function() {
            broadcastAll();
            console.log('Successful database sync.');
        });
    }).catch(function(err){
        console.log('Failed database sync: ');
        console.log(err);
        setTimeout(sync, 5000);
    });
};

function broadcastAll() {
    io.emit('db_status', app.locals.dbready);

    if  (app.locals.dbready) {
        db.Sample.count().then(function(val){
            io.emit('sample_count', val);
        });
        db.Neuron.count().then(function(val){
            io.emit('neuron_count', val);
        });
        db.InjectionLocation.count().then(function(val){
            io.emit('injection_count', val);
        });
        db.RegistrationTransform.count().then(function(val){
            io.emit('registration_count', val);
        });
        db.StructureIdentifier.count().then(function(val){
            io.emit('structure_count', val);
        });
        db.Virus.count().then(function(val){
            io.emit('virus_count', val);
        });
        db.Strain.count().then(function(val){
            io.emit('strain_count', val);
        });
    } else {
        io.emit('sample_count', -1);
        io.emit('neuron_count', -1);
        io.emit('injection_count', -1);
        io.emit('registration_count', -1);
        io.emit('structure_count', -1);
        io.emit('virus_count', -1);
        io.emit('strain_count', -1);
    }
};
