var express = require('express');
var router = express.Router();


var servicePort = process.env.SWC_SERVICE_PORT || 9651;

var env = process.env.NODE_ENV || 'development';

var serviceHost = 'localhost';

if (env === 'production') {
  serviceHost = 'swcservice';
}

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', {title: 'SWC File Service Status', serviceHost: serviceHost });
});

module.exports = router;
