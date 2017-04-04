'use strict';

var util = require('util');
var app = require('../../app');
var errors = require('../helpers/errors');
const models = require('../data-access/databaseConnector').PersistentStorageManager.Instance();

module.exports = {
    get: get,
    getRegistrationTransformById: getRegistrationTransformById,
    post: post,
    updateRegistrationTransform: updateRegistrationTransform,
    deleteRegistrationTransform: deleteRegistrationTransform
};

function get(req, res) {
    models.RegistrationTransform.findAll({}).then(function (transforms) {
        res.json(transforms);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getRegistrationTransformById(req, res) {
    models.RegistrationTransform.findAll({where: {id: req.swagger.params.transformId.value}, limit: 1}).then(function (tranforms) {
        if (tranforms.length > 0)
            res.json(tranforms[0]);
        else
            res.status(500).json(errors.idDoesNotExit());
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res) {
    if (req.body.name === undefined || req.body.name === null) {
        res.status(500).json(errors.invalidName());
        return;
    }

    models.RegistrationTransform.findAll({where:{location: req.body.location}}).then(function (registration) {
        if (registration != null && registration.length > 0) {
            res.status(500).json(errors.duplicateRegistration());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    var sampleId = body.sampleId || null;
    var name = body.name || '';
    var location = body.location || '';
    var notes = body.notes || '';

    models.RegistrationTransform.create({
        idNumber: body.idNumber,
        sampleId: sampleId,
        name: name,
        location: location,
        notes: notes
    }).then(function (registration) {
        res.json(registration);
        app.broadcast();
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateRegistrationTransform(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.RegistrationTransform.findAll({where:{id: req.body.id}}).then(function (registrationTransforms) {
        if (registrationTransforms === null || registrationTransforms.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            update(registrationTransforms[0], req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function update(registrationTransform, body, res) {
    var name = body.name || '';
    var location = body.location || '';
    var notes = body.notes || '';

    registrationTransform.update({
        name: name,
        location: location,
        notes: notes
    }).then(function (updatedRegistration) {
        res.json(updatedRegistration);
        app.broadcast();
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function deleteRegistrationTransform(req, res) {
    var registrationTransformParam = req.swagger.params.transformId;

    if (registrationTransformParam === undefined || registrationTransformParam === null || registrationTransformParam.value === undefined || registrationTransformParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    var registrationTransformId = registrationTransformParam.value;

    models.RegistrationTransform.findAll({where:{id: registrationTransformId}}).then(function (registrationTransforms) {
        if (registrationTransforms === null || registrationTransforms.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var registrationTransform = registrationTransforms[0];

            registrationTransform.destroy().then(function () {
                res.json({id: registrationTransformId});
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
