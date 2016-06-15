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
    getTransformById: getTransformById,
    post: post
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.RegistrationTransform.findAll({}).then(function (transforms) {
        res.json(transforms);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getTransformById(req, res) {
    models.RegistrationTransform.findAll({where: {id: req.swagger.params.transformId.value}, limit: 1}).then(function (tranforms) {
        if (tranforms.length > 0)
            res.json(tranforms[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res, next) {
    if (req.body.name === undefined || req.body.name === null) {
        res.status(500).json(errors.invalidName());
        return;
    }

    models.RegistrationTransform.findAll({where:{name: req.body.name}}).then(function (registration) {
        if (registration != null && registration.length > 0) {
            res.status(500).json(errors.duplicateRegistration());
        } else {
            return create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    return models.RegistrationTransform.create({
        name: body.name,
        mutable: true
    }).then(function (registration) {
        res.json(registration);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
