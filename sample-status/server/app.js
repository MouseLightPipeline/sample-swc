var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var serviceHostUrl = '';

var connected = false;

connectToServiceIO();

io.on('connection', function(socket) {
    console.log('Web client connected to status service.')

    socket.on('disconnect', function(){
        console.log('Web client disconnected from status service.')
    });

    socket.emit("serviceHostUrl", serviceHostUrl);
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
        serviceHost = 'sample-service';
    }

    serviceHostUrl = 'http://' + serviceHost + ':9641';
}
