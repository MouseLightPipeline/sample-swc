var express = require('express');
var glob = require('glob');
//var request = require('request');
var path = require('path');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  app.locals.serviceHost = config.service;
  app.locals.statusHost = config.status;

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

 // app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
//  app.use(cookieParser());
  app.use(compress());
  app.use('/', express.static(path.normalize(config.root + '/../public')));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
