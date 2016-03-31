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

app.locals.dbready = false;

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.emit('db_status', app.locals.dbready);
  
  if  (app.locals.dbready) {
    db.SwcFile.count().then(function(val){
      socket.emit('file_count', val);
    });
    db.NeuronSample.count().then(function(val){
      socket.emit('sample_count', val);
    });
  }
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

module.exports.app = app; // for testing
module.exports.io = io;

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

sync();

function sync()
{
  db.sequelize.sync().then(function() {
    app.locals.dbready = true;
    io.emit('db_status', app.locals.dbready);

    db.SwcFile.count().then(function(val){
       io.emit('file_count', val);
    });
    db.NeuronSample.count().then(function(val){
       io.emit('sample_count', val);
    });
    console.log('Successful database sync.');
  }).catch(function(err){
    console.log('Failed database sync.');
    setTimeout(sync, 5000);
  });
}