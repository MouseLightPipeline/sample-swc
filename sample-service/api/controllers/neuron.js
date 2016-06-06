'use strict';

var util = require('util');
var app = require('../../app');
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
    post: post,
    getNeuronById: getNeuronById,
    getNeuronsForSample: getNeuronsForSample
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Neuron.findAll({include:GET_NEURON_INCLUDE}).then(function (neurons) {
        res.json(neurons);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getNeuronById(req, res) {
    models.Neuron.findAll({include:GET_NEURON_INCLUDE, where: {id: req.swagger.params.neuronId.value}, limit: 1}).then(function (neurons) {
        if (neurons.length > 0)
            res.json(neurons[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getNeuronsForSample(req, res) {
    models.Neuron.findAll({where: {sampleId: req.swagger.params.sampleId.originalValue}}).then(function (neurons) {
        res.json(neurons);
    }).catch((err) => {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res, next) {
    if (req.body.idNumber === undefined || req.body.idNumber === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }
    models.Neuron.findAll({where:{idNumber: req.body.idNumber}}).then(function (neuron) {
        if (neuron != null && neuron.length > 0) {
            res.status(500).json(errors.duplicateNeuron());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });    
}

function create(body, res) {
    var sampleId = body.sampleId || null;
    var brainAreaId = body.brainAreaId || null;
    var x = body.x || 0;
    var y = body.y || 0;
    var z = body.z || 0;
    
    models.Neuron.create({
            idNumber: body.idNumber,
            sampleId: sampleId,
            brainAreaId: brainAreaId,
            x: x,
            y: y,
            z: z
        }).then(function (neuron) {
        res.json(neuron);
        app.broadcast();
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

var GET_NEURON_INCLUDE =
[
    {
        model: models.Sample,
        as: 'sample'
    },
    {
        model: models.BrainArea,
        as: 'brainArea'
    }
]
