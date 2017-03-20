var express = require('express');
var router = express.Router();

module.exports = function (app) {
  app.use('/service', router);
};

router.get('/', function (req, res, next) {
    res.json({service: req.app.locals.serviceHost, sampleService: req.app.locals.sampleHost});
});
