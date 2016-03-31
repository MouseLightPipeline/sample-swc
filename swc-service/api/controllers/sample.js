'use strict';

var util = require('util');

var models = require('../models/index');
/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    get: getfiles,
    findByStructure: findByStructure
};

/*
 Functions in controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */

function getfiles(req, res) {
    // models.SwcFile.findAll({}).then(function(files){
    // models.NeuronSample.findAll({include:[models.SwcFile, {model: models.NeuronSample, as: 'parent'}]}).then(function(files){
    models.NeuronSample.findAll({}).then(function (samples) {
        res.json(samples);
    }).catch(function(){
        res.status(503).json({code: 503, message: 'Database service unavailable.'});
    });
}

function findByStructure(req, res) {
    var id = parseInt(req.swagger.params.structure.value);
    
    console.log(id);
    
    if (!isNaN(id)) {
        models.NeuronSample.findAll({where: {structure: id}, include:[{model:models.SwcFile, attributes:['filename']}], order: [[models.SwcFile, 'filename', 'ASC'], ['sampleNumber', 'ASC']]}).then(function (samples) {
            res.json(samples);
        }).catch(function(e){
            console.log(e);
            res.status(400);
            //res.status(503).json({code: 503, message: 'Database service unavailable.'});
        });
        //res.status(200).json([]);
    } else {
        res.status(400);
    }
}
