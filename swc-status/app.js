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

connectToServiceIO();

io.on('connection', function(socket) {
  console.log('Status client connected.')
  
  socket.emit('connected', connected);
  socket.emit('file_count', fileCount);
  socket.emit('sample_count', sampleCount);
  
  socket.on('disconnect', function(){
    console.log('Status client disconnected.')
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
app.use(express.static(path.join(__dirname, 'public')));

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
 
  var serviceSocket = client.connect('http://localhost:9651');
  
  serviceSocket.on('connect', function(msg) {
    connected = true;
    io.emit('connected', connected);
  });
  serviceSocket.on('reconnect', function(msg) {
    connected = true;
    io.emit('connected', connected);
  });
  serviceSocket.on('disconnect', function(msg) {
    connected = false;
    io.emit('connected', connected);
  });
  serviceSocket.on('error', function(msg) {
    connected = false;
    io.emit('connected', connected);
  });
  serviceSocket.on('file_count', function(msg) {
    fileCount = msg;
    io.emit('file_count', msg);
  });
  serviceSocket.on('sample_count', function(msg) {
    sampleCount = msg;
    io.emit('sample_count', msg);
  });
}