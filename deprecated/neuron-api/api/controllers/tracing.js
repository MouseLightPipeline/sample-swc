'use strict';

var errors = require('../helpers/errors');
var models = require('../models/index');
var restClient = require('node-rest-client').Client;

var client = new restClient();

/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    get: get,
    migrate: migrateTracings
};

/*
 res.set({
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
 });
 */

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Tracing.findAll({}).then((tracings) => {
        res.json(tracings);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function migrateTracings(req, res) {
    client.get('http://localhost:9651/api/v1/tracings', (data) => {
        models.Tracing.migrateSwcTracings(models, data).then((tracing) => {
            res.status(200).send({tracingCount: tracing.length});
        }).catch((err)  =>{
            res.status(500).json(errors.sequelizeError(err));
        });
    }).on('error', (error) => {
        console.log(error);
        res.status(500).json({error: error.code});
    });
}
