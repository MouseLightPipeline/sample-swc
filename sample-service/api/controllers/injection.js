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
    post: post
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.InjectionLocation.findAll({}).then(function (locations) {
        res.json(locations);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res, next) {
    if (req.body.name === undefined || req.body.name === null) {
        res.status(500).json(errors.invalidName());
        return;
    }
    
    models.InjectionLocation.findAll({where:{name: req.body.name}}).then(function (injection) {
        if (injection != null && injection.length > 0) {
            res.status(500).json(errors.duplicateInjection());
        } else {
            create(req.body, res);
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });    
}

function create(body, res) {
    models.InjectionLocation.create({
            name: body.name,
            mutable: true
    }).then(function (injection) {
        res.json(injection);
        app.broadcast();
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
