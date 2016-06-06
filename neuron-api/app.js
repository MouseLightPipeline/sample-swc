'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');

var db = require('./api/models/index');
var app = require('express')();

var http = require('http').Server(app);

module.exports = app; // for testing

app.locals.dbready = false;

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 9661;
  
  http.listen(port);
});

sync();

function sync() {
    db.sequelize.sync().then(function() {
        app.locals.dbready = true;
        
        db.NodeType.populateDefault().then(function() {
            broadcastAll();
            console.log('Successful database sync.');
        });
    }).catch(function(err){
        console.log('Failed database sync: ');
        console.log(err);
        setTimeout(sync, 5000);
    });
};