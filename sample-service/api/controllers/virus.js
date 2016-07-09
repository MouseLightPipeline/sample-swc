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
    getVirusById: getVirusById,
    post: post
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.Virus.findAll({}).then(function (viruses) {
        res.json(viruses);
    }).catch(function(){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getVirusById(req, res) {
    models.Virus.findAll({where: {id: req.swagger.params.virusId.value}, limit: 1}).then(function (virus) {
        if (virus.length > 0)
            res.json(virus[0]);
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

    models.Virus.findAll({where:{name: req.body.name}}).then(function (virus) {
        if (virus != null && virus.length > 0) {
            res.status(500).json(errors.duplicateVirus());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    models.Virus.create({
        name: body.name,
        mutable: true
    }).then(function (virus) {
        res.json(virus);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
