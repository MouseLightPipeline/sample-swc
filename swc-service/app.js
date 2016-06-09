'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var db = require('./api/models/index');
//var bodyParser = require('body-parser');
var express = require('express');
var multer = require('multer');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.locals.dbready = false;

io.on('connection', function(socket) {
    broadcastAll();
});

module.exports.app = app; // for testing
module.exports.broadcast = broadcastAll;

var config = {
    appRoot: __dirname      // required config
};

app.use('/script/socket.io', express.static(__dirname + '/node_modules/socket.io-client'));


//app.use(require('skipper')());
var upload = multer({ dest: 'uploads/' })
app.use(upload.single('contents'));
    
//app.post('/api/v1/uploads', upload.single('contents'), function (req, res, next) {
//    console.log(req.file)
//    console.log(req.body);
  // req.file is the `avatar` file 
  // req.body will hold the text fields, if there were any 
//})

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    //app.user

    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);
  
    var port = process.env.PORT || 9651;
  
    http.listen(port);
});

sync();

function sync() {
    db.sequelize.sync().then(function() {      
        app.locals.dbready = true;
    
        db.StructureIdentifier.populateDefault().then(function() {
            broadcastAll();
            console.log('Successful database sync.');
        });
    }).catch(function(err){
        console.log('Failed database sync.');
        console.log(err);
        setTimeout(sync, 5000);
    });
}

function broadcastAll() {
    io.emit('db_status', app.locals.dbready);

    if  (app.locals.dbready) {
        db.Tracing.count().then(function(val){
            io.emit('tracingCount', val);
        });
        db.TracingNode.count().then(function(val){
            io.emit('tracingNodeCount', val);
        });
        db.StructureIdentifier.count().then(function(val){
            io.emit('structureIdentifierCount', val);
        });
    } else {
        io.emit('tracingCount', -1);
        io.emit('tracingNodeCount', -1);
        io.emit('markerLocationCount', -1);
        io.emit('structureIdentifierCount', -1);
    }
};
