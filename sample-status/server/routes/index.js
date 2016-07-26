var express = require('express');
var router = express.Router();


var servicePort = process.env.SAMPLE_SERVICE_PORT || 9641;

var env = process.env.NODE_ENV || 'development';

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', {title: 'Sample Service Status'});
});

module.exports = router;
