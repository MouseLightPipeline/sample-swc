'use strict';

var util = require('util');
var app = require('../../app');
var errors = require('../helpers/errors');
var models = require('../models/index');

module.exports = {
    get: get,
    getSampleById: getSampleById,
    post: post,
    updateSample: updateSample,
    deleteSample: deleteSample
};

function get(req, res) {
    models.Sample.findAll(/*{include:GET_SAMPLE_INCLUDE}*/).then(function (samples) {
        res.json(samples);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getSampleById(req, res) {
    models.Sample.findAll({/*include:GET_SAMPLE_INCLUDE, */where: {id: req.swagger.params.sampleId.value}, limit: 1}).then(function (samples) {
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
    var sampleDate = (body.sampleDate && body.sampleDate.length > 0) ? new Date(body.sampleDate) : new Date();
    var tag = body.tag || '';
    var comment = body.comment || '';
    var registrationTransformId = body.registrationTransformId || null;
    var mouseStrainId = body.mouseStrainId || null;

    models.Sample.create({
        idNumber: body.idNumber,
        sampleDate: sampleDate,
        tag: tag,
        comment: comment,
        registrationTransformId: registrationTransformId,
        mouseStrainId: mouseStrainId
    }).then(function (sample) {
        res.json(sample);
        app.broadcast();
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateSample(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Sample.findAll({where:{id: req.body.id}}).then(function (samples) {
        if (samples === null || samples.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var sample = samples[0];

            sample.update({
                sampleDate: req.body.sampleDate,
                tag: req.body.tag,
                comment: req.body.comment,
                registrationTransformId: req.body.registrationTransformId,
                mouseStrainId: req.body.mouseStrainId
            }).then(function (updated) {
                res.json(updated);
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function deleteSample(req, res) {
    var sampleParam = req.swagger.params.sampleId;

    if (sampleParam === undefined || sampleParam === null || sampleParam.value === undefined || sampleParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    var sampleId = sampleParam.value;

    models.Sample.findAll({where:{id: sampleId}}).then(function (samples) {
        if (samples === null || samples.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var sample = samples[0];

            sample.destroy().then(function () {
                res.json({id: sampleId});
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
