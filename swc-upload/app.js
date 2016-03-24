'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var multer  = require('multer');
var db = require('./models/index');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use('/', express.static(__dirname + '/static'));

app.use('/style/bootstrap', express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.use('/script/bootstrap', express.static(__dirname + '/bower_components/bootstrap/dist/js'));
app.use('/script/jquery', express.static(__dirname + '/bower_components/jquery/dist'));

app.use(multer({dest:'./uploads/', includeEmptyFields: true}).single('contents'));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);
  
  var port = process.env.PORT || 9651;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/files']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/files');
  }
});

db.sequelize.sync();
