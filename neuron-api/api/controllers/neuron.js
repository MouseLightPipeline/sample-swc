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
    migrateNeuron: migrateNeuron
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Neuron.findAll({}).then(function (neurons) {
        res.json(neurons);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function migrateNeuron(req, res) {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
    
    models.Neuron.findAll({where: {sourceNeuronId: req.swagger.params.sourceNeuronId.value}, limit: 1}).then((neurons) => {        
        if (neurons.length > 0) {
            res.status(200).json(neurons[0]);
        } else {
            models.Neuron.create({sourceNeuronId: req.swagger.params.sourceNeuronId.value}).then((neuron) => {
                res.status(200).json(neuron);
            }).catch((error) => {
                res.status(500).json(errors.sequelizeError(error));
            });
        }        
    }).catch((error) => {
        res.status(500).json(errors.sequelizeError(error));
    });   
}
