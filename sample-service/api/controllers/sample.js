"use strict";

const util = require("util");
const app = require("../../app");
const errors = require("../helpers/errors");
const models = require("../models/index");

module.exports = {
    get: get,
    getSampleById: getSampleById,
    post: post,
    updateSample: updateSample,
    deleteSample: deleteSample
};

function get(req, res) {
    models.Sample.findAll({order:[["idNumber", "DESC"]]}).then(function (samples) {
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
            res.status(500).json({message: "bad id"});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res) {
    if (req.body.idNumber === undefined || req.body.idNumber === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Sample.findAll({where:{idNumber: req.body.idNumber}}).then(function (sample) {
        if (sample !== null && sample.length > 0) {
            res.status(500).json(errors.duplicateSample());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    const sampleDate = (body.sampleDate && body.sampleDate.length > 0) ? new Date(body.sampleDate) : new Date();
    const animalId = body.animalId || '';
    const tag = body.tag || '';
    const comment = body.comment || '';
    const activeRegistrationTransformId = body.activeRegistrationTransformId || '';
    const mouseStrainId = body.mouseStrainId || null;

    models.Sample.create({
        idNumber: body.idNumber,
        sampleDate: sampleDate,
        animalId: animalId,
        tag: tag,
        comment: comment,
        activeRegistrationTransformId: activeRegistrationTransformId,
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
            const sample = samples[0];

            const activeRegistrationTransformId = req.body.activeRegistrationTransformId || '';
            const mouseStrainId = req.body.mouseStrainId || null;
            const animalId = req.body.animalId || '';

            sample.update({
                sampleDate: req.body.sampleDate,
                animalId: animalId,
                tag: req.body.tag,
                comment: req.body.comment,
                activeRegistrationTransformId: activeRegistrationTransformId,
                mouseStrainId: mouseStrainId
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
    const sampleParam = req.swagger.params.sampleId;

    if (sampleParam === undefined || sampleParam === null || sampleParam.value === undefined || sampleParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    const sampleId = sampleParam.value;

    models.Sample.findAll({where:{id: sampleId}}).then(function (samples) {
        if (samples === null || samples.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const sample = samples[0];

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
