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

var fileCount = 0;

var sampleCount = 0;

var db_status = false;

connectToServiceIO();

io.on('connection', function(socket) {
  console.log('Web client connected to status service.')
  
  socket.emit('connected', connected);
  socket.emit('file_count', fileCount);
  socket.emit('sample_count', sampleCount);
  socket.emit('db_status', db_status);
  
  socket.on('disconnect', function(){
    console.log('Web client disconnected from status service.')
  });
});

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
    sample_count = 0;
    file_count = 0;
    db_status = false;
    io.emit('connected', connected);
    io.emit('db_status', db_status);
    io.emit('file_count', file_count);
    io.emit('sample_count', sample_count);
  });
  serviceSocket.on('error', function(msg) {
    console.log('Error for REST servivce');
    connected = false;
    io.emit('connected', connected);
  });
  serviceSocket.on('db_status', function(msg) {
    console.log('Received file count update from REST servivce');
    db_status = msg;
    io.emit('db_status', msg);
  });
  serviceSocket.on('file_count', function(msg) {
    console.log('Received file count update from REST servivce');
    fileCount = msg;
    io.emit('file_count', msg);
  });
  serviceSocket.on('sample_count', function(msg) {
    console.log('Received sample count update from REST servivce');
    sampleCount = msg;
    io.emit('sample_count', msg);
  });
}