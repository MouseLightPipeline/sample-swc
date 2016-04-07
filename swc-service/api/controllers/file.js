'use strict';

var util = require('util');

var models = require('../models/index');
/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    get: get
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    // models.SwcFile.findAll({}).then(function(files){
    // models.NeuronSample.findAll({include:[models.SwcFile, {model: models.NeuronSample, as: 'parent'}]}).then(function(files){
    models.SwcFile.findAll({}).then(function (files) {
        res.json(files);
    }).catch(function(){
        res.status(503).json({code: 503, message: 'Database service unavailable.'});
    });
}
