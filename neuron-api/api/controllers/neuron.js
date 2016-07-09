'use strict';

var errors = require('../helpers/errors');
var models = require('../models/index');
var sampleApi = require('../helpers/sampleApi');

/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    get: get,
    migrate: migrateNeurons,
    migrateOne: migrateNeuron
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
    models.Neuron.findAll({}).then((neurons) => {
        res.json(neurons);
    }).catch((err) => {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function migrateNeuron(req, res) {
    sampleApi.requestNeuron(req.swagger.params.sourceNeuronId.value).then((data) => {
        models.Neuron.migrateSwcNeuron(data).then((neuron) => {
            res.status(200).json(neuron);
        });
    }).catch((error) => {
        res.status(500).json(errors.sequelizeError(error));
    });
}

function migrateNeurons(req, res) {
    sampleApi.requestNeurons().then((data) => {
        models.Neuron.migrateSwcNeurons(data).then((neurons) => {
            res.status(200).send({neuronCount: neurons.length});
        });
    }).catch((err) => {
        res.status(500).json(errors.sequelizeError(err));
    });
}
