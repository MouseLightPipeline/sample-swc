'use strict';

const util = require('util');
const errors = require('../helpers/errors');
const models = require('../models/index');

/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    get: get,
    getTracingById: getTracingById,
    forTracing: forTracing
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.SwcTracing.findAll({}).then(function (tracings) {
        res.json(tracings);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getTracingById(req, res) {
    models.SwcTracing.findAll({where: {id: req.swagger.params.tracingId.value}, limit: 1}).then(function (tracings) {
        if (tracings.length > 0)
            res.json(tracings[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function forTracing(req, res) {
    const id = req.swagger.params.swcTracingId.value;
    
    models.SwcTracingNode.findAll({where: {swcTracingId: id}, order: [['sampleNumber', 'ASC']]}).then(function (samples) {
        res.json(samples);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
