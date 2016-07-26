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
    getBrainAreaById: getBrainAreaById,
    getBrainAreasForDepth: getBrainAreasForDepth,
    getBrainAreasForParent: getBrainAreasForParent
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function get(req, res) {
    models.BrainArea.findAll({}).then(function (areas) {
        res.json(areas);
    }).catch(function(err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getBrainAreaById(req, res) {
    models.BrainArea.findAll({where: {id: req.swagger.params.brainAreaId.value}, limit: 1}).then(function (areas) {
        if (areas.length > 0)
            res.json(areas[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getBrainAreasForDepth(req, res) {
    models.BrainArea.findAll({where: {depth: req.swagger.params.depth.value}}).then((areas) => {
        res.json(areas);
    }).catch(function(err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getBrainAreasForParent(req, res) {
    models.BrainArea.findAll({where: {parentStructureId: req.swagger.params.parentId.value}}).then((areas) => {
        res.json(areas);
    }).catch(function(err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}
