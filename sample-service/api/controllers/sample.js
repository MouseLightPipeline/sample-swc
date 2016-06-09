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
    getSampleById: getSampleById,
    post: post
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Sample.findAll({include:GET_SAMPLE_INCLUDE}).then(function (samples) {
        res.json(samples);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getSampleById(req, res) {
    models.Sample.findAll({include:GET_SAMPLE_INCLUDE, where: {id: req.swagger.params.sampleId.value}, limit: 1}).then(function (samples) {
        if (samples.length > 0)
            res.json(samples[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res, next) {
    if (req.body.idNumber === undefined || req.body.idNumber === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Sample.findAll({where:{idNumber: req.body.idNumber}}).then(function (sample) {
        if (sample != null && sample.length > 0) {
            res.status(500).json(errors.duplicateSample());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    var date = (body.sampleDate && body.sampleDate.length > 0) ? new Date(body.sampleDate) : new Date();
    var tag = body.tag || '';
    var comment = body.comment || '';
    var injectionLocationId = body.injectionLocationId || null;
    var registrationId = body.registrationTransformId || null;
    var strainId = body.strainId || null;

    models.Sample.create({
        idNumber: body.idNumber,
        sampleDate: date,
        tag: tag,
        comment: comment,
        injectionLocationId: injectionLocationId,
        registrationTransformId: registrationId,
        strainId: strainId
    }).then(function (sample) {
        console.log(sample);
        res.json(sample);
        app.broadcast();
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function replaceWithEmptyObject(prop) {
    return (prop ? prop.dataValues : null) || {};
}

var GET_SAMPLE_INCLUDE =
    [
        {
            model: models.InjectionLocation,
            as: 'injectionLocation'
        },
        {
            model: models.RegistrationTransform,
            as: 'registrationTransform'
        },
        {
            model: models.Strain,
            as: 'strain'
        }
    ]
