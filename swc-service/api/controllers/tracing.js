'use strict';

var util = require('util');
var errors = require('../helpers/errors');
var models = require('../models/index');
/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    get: get,
    forTracing: forTracing
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Tracing.findAll({}).then(function (tracings) {
        res.json(tracings);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function forTracing(req, res) {
    var id = req.swagger.params.tracingId.value;
    
    models.TracingNode.findAll({where: {tracingId: id}, order: [['sampleNumber', 'ASC']]}).then(function (samples) {
        res.json(samples);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
