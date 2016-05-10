var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var connected = false;

var serviceSocket = null;

var sampleCount = 0;

var neuronCount = 0;

var injectionCount = 0;

var registrationCount = 0;

var structureCount = 0;

var virusCount = 0;

var strainCount = 0;

var db_status = false;

connectToServiceIO();

io.on('connection', function(socket) {
    console.log('Web client connected to status service.')
  
    relayAllStatus();
  
    socket.on('disconnect', function(){
        console.log('Web client disconnected from status service.')
    });
});

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));

app.use(cookieParser());
console.log(path.normalize(__dirname + '/../public'))
app.use('/', express.static(path.normalize(__dirname + '/../public')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;

app.set('port', process.env.PORT || 9642);

var server = http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});


function connectToServiceIO() {
    serviceHost = 'localhost';

    if (process.env.NODE_ENV === 'production') {
        serviceHost = 'sampleservice';
    }
  
    var host = 'http://' + serviceHost + ':9641';
  
    var client = require('socket.io-client');
 
    var serviceSocket = client.connect(host);
  
    console.log('Trying to establish socket connection to REST service at ' + host);
  
    serviceSocket.on('connect', function(msg) {
        console.log('Connected to REST service');
        connected = true;
        io.emit('connected', connected);
    });
    serviceSocket.on('reconnect', function(msg) {
        console.log('Reconnected to REST service');
        connected = true;
        io.emit('connected', connected);
    });
    serviceSocket.on('disconnect', function(msg) {
        console.log('Disconnected from REST service');
        connected = false;
        sampleCount = 0;
        neuronCount = 0;
        injectionCount = 0
        db_status = false;
        relayAllStatus();
    });
    serviceSocket.on('error', function(msg) {
        console.log('Error for REST service');
        connected = false;
        io.emit('connected', connected);
    });
    serviceSocket.on('db_status', function(msg) {
        console.log('Received file count update from REST service');
        db_status = msg;
        io.emit('db_status', msg);
    });
    serviceSocket.on('sample_count', function(msg) {
        console.log('Received sample count update from REST service');
        sampleCount = msg;
        io.emit('sample_count', msg);
    });
    serviceSocket.on('neuron_count', function(msg) {
        console.log('Received neuron count update from REST service');
        neuronCount = msg;
        io.emit('neuron_count', msg);
    });
    serviceSocket.on('injection_count', function(msg) {
        console.log('Received injection location count update from REST service');
        injectionCount = msg;
        io.emit('injection_count', msg);
    });
    serviceSocket.on('registration_count', function(msg) {
        console.log('Received registration transform count update from REST service');
        registrationCount = msg;
        io.emit('registration_count', msg);
    });
    serviceSocket.on('structure_count', function(msg) {
        console.log('Received structure identifier count update from REST service');
        structureCount = msg;
        io.emit('structure_count', msg);
    });
    serviceSocket.on('virus_count', function(msg) {
        console.log('Received virus count update from REST service');
        virusCount = msg;
        io.emit('virus_count', msg);
    });
    serviceSocket.on('strain_count', function(msg) {
        console.log('Received strain count update from REST service');
        strainCount = msg;
        io.emit('strain_count', msg);
    });
}

function relayAllStatus() {
    io.emit('connected', connected);
    io.emit('db_status', db_status);
    io.emit('sample_count', sampleCount);
    io.emit('neuron_count', neuronCount);
    io.emit('injection_count', injectionCount);
    io.emit('registration_count', registrationCount);
    io.emit('structure_count', structureCount);
    io.emit('virus_count', virusCount);
    io.emit('strain_count', strainCount);
}