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
    getStrainsForVirus: getStrainsForVirus,
    getStrainById: getStrainById,
    post: post
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Strain.findAll({}).then(function (strains) {
        res.json(strains);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}


function getStrainsForVirus(req, res) {
    models.Strain.findAll({where: {virusId: req.swagger.params.virusId.originalValue}}).then(function (strains) {
        res.json(strains);
    }).catch((err) => {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getStrainById(req, res) {
    models.Strain.findAll({where: {id: req.swagger.params.strainId.value}, limit: 1}).then(function (strain) {
        if (strain.length > 0)
            res.json(strain[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res, next) {
    console.log(req.body);

    if (req.body.name === undefined || req.body.name === null) {
        res.status(500).json(errors.invalidName());
        return;
    }

    if (req.body.virusId === undefined || req.body.virusId === null) {
        res.status(500).json(errors.invalidName());
        return;
    }

    models.Strain.findAll({where:{name: req.body.name, virusId: req.body.virusId}}).then(function (strain) {
        if (strain != null && strain.length > 0) {
            res.status(500).json(errors.duplicateStrain());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    models.Strain.create({
        name: body.name,
        virusId: body.virusId,
        mutable: true
    }).then(function (strain) {
        res.json(strain);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
