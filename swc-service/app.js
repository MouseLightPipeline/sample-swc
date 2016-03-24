'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var db = require('./api/models/index');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('a user connected');
  db.SwcFile.count().then(function(val){
     socket.emit('file_count', val);
  })
  db.NeuronSample.count().then(function(val){
     socket.emit('sample_count', val);
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

module.exports.app = app; // for testing
module.exports.io = io; // for testing

var config = {
  appRoot: __dirname      // required config
};

app.use('/script/socket.io', express.static(__dirname + '/node_modules/socket.io-client'));

app.use(require('skipper')());

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);
  
  var port = process.env.PORT || 9651;
  
  http.listen(port);
});

db.sequelize.sync();
