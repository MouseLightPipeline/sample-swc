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
    getStrainsForVirus: getStrainsForVirus
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
