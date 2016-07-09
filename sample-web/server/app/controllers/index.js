var express = require('express');
var router = express.Router();


module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {appName: 'sampleManager', appController: 'appController', title: 'Mouse Light Sample Manager'});
});
