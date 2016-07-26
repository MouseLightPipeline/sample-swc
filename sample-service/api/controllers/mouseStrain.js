'use strict';

var util = require('util');
var app = require('../../app');
var errors = require('../helpers/errors');
var models = require('../models/index');

module.exports = {
    get: get,
    getStrainById: getMouseStrainById,
    post: post,
    updateMouseStrain: updateMouseStrain,
    deleteMouseStrain: deleteMouseStrain
};

function get(req, res) {
    models.MouseStrain.findAll({}).then(function (strains) {
        res.json(strains);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getMouseStrainById(req, res) {
    models.MouseStrain.findAll({where: {id: req.swagger.params.strainId.value}, limit: 1}).then(function (strain) {
        if (strain.length > 0)
            res.json(strain[0]);
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

    models.MouseStrain.findAll({where:{name: req.body.name}}).then(function (strain) {
        if (strain != null && strain.length > 0) {
            res.status(500).json(errors.duplicateStrain());
        } else {
            models.MouseStrain.create({
                name: req.body.name
            }).then(function (strain) {
                res.json(strain);
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateMouseStrain(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.MouseStrain.findAll({where:{id: req.body.id}}).then(function (strains) {
        if (strains === null || strains.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var strain = strains[0];

            if (req.body.name === undefined || req.body.name === null) {
                res.status(500).json(errors.invalidName());
                return;
            }

            strain.update({
                name: req.body.name
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

function deleteMouseStrain(req, res) {
    var mouseStrainParam = req.swagger.params.strainId;

    if (mouseStrainParam === undefined || mouseStrainParam === null || mouseStrainParam.value === undefined || mouseStrainParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    var mouseStrainId = mouseStrainParam.value;

    models.MouseStrain.findAll({where:{id: mouseStrainId}}).then(function (strains) {
        if (strains === null || strains.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var strain = strains[0];

            strain.destroy().then(function () {
                res.json({id: mouseStrainId});
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
