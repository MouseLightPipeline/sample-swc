var express = require('express');
var router = express.Router();

module.exports = function (app) {
  app.use('/service', router);
};

router.get('/', function (req, res, next) {
    res.json({service: req.app.locals.serviceHost, status: req.app.locals.statusHost});
});
