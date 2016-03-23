'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var multer  = require('multer');
var db = require('./models/index');

var app = require('express')();

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use(multer({dest:'./uploads/'}).single('contents'));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);
  
  var port = process.env.PORT || 3000;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/files']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/files');
  }
});

// Swagger will advertise this endpoint, but override to handle the file delivered by multer.
app.post('/api/v1/upload', function(req, res, next){
  //console.log(req);
  console.log(req.file.mimetype);
  console.log('Would remove ' + req.file.path);
  res.send('Done');
  
  var fs = require('fs'), byline = require('byline');

  var stream = byline(fs.createReadStream(req.file.path, { encoding: 'utf8' }));
  
  var samples = [];
  
  //var swcFile = 
  
  stream.on('data', function(line) {
    var res = line.trim().split(' ');
    console.log(res);
  });
});

db.sequelize.sync();
