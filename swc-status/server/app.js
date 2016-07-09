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

var traceCount = 0;

var traceNodeCount = 0;

var structureIdentifierCount = 0;

var markerLocationCount = 0;

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

app.set('port', process.env.PORT || 9652);

var server = http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});


function connectToServiceIO() {
    serviceHost = 'localhost';

    if (process.env.NODE_ENV === 'production') {
        serviceHost = 'swcservice';
    }
  
    var host = 'http://' + serviceHost + ':9651';
  
    var client = require('socket.io-client');
 
    var serviceSocket = client.connect(host);
  
    console.log('Trying to establish socket connection to REST service at ' + host);
  
    serviceSocket.on('connect', function(msg) {
        console.log('Connected to REST servivce');
        connected = true;
        io.emit('connected', connected);
    });
    serviceSocket.on('reconnect', function(msg) {
        console.log('Reconnected to REST servivce');
        connected = true;
        io.emit('connected', connected);
    });
    serviceSocket.on('disconnect', function(msg) {
        console.log('Disconnected from REST servivce');
        connected = false;
        traceCount = 0;
        traceNodeCount = 0;
        structureCount = 0;
        db_status = false;
        relayAllStatus();
    });
    serviceSocket.on('error', function(msg) {
        console.log('Error for REST servivce');
        connected = false;
        io.emit('connected', connected);
    });
    serviceSocket.on('db_status', function(msg) {
        console.log('Received file count update from REST service');
        db_status = msg;
        io.emit('db_status', msg);
    });
    serviceSocket.on('traceCount', function(msg) {
        console.log('Received trace count update from REST service');
        traceCount = msg;
        io.emit('traceCount', msg);
    });
    serviceSocket.on('traceNodeCount', function(msg) {
        console.log('Received traceNode count update from REST service');
        traceNodeCount = msg;
        io.emit('traceNodeCount', msg);
    });
    serviceSocket.on('structureIdentifierCount', function(msg) {
        console.log('Received structure identifier count update from REST service');
        structureIdentifierCount = msg;
        io.emit('structureIdentifierCount', msg);
    });
    serviceSocket.on('markerLocationCount', function(msg) {
        console.log('Received markerLocation count update from REST service');
        markerLocationCount = msg;
        io.emit('markerLocationCount', msg);
    });
}

function relayAllStatus() {
    io.emit('connected', connected);
    io.emit('db_status', db_status);
    io.emit('traceCount', traceCount);
    io.emit('traceNodeCount', traceNodeCount);
    io.emit('structureIdentifierCount', structureIdentifierCount);
    io.emit('markerLocationCount', markerLocationCount);
}