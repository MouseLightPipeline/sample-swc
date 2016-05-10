var express = require('express');
var router = express.Router();
var restClient = require('node-rest-client').Client;
 
var client = new restClient();
 
module.exports = function (app) {
  app.use('/service', router);
};

router.get('/', function (req, res, next) {
    res.json([{service: 'http://' + req.app.locals.apiHost + '/api/v1/'}]);
});
