var express = require('express');
var router = express.Router();
var restClient = require('node-rest-client').Client;
 
var client = new restClient();
 
module.exports = function (app) {
  app.use('/service', router);
};

router.get('/', function (req, res, next) {
    res.json({service: req.app.locals.serviceHost, status: req.app.locals.statusHost, sampleService: req.app.locals.sampleHost});
});
