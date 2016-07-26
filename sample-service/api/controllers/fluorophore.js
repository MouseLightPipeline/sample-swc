'use strict';

var util = require('util');
var app = require('../../app');
var errors = require('../helpers/errors');
var models = require('../models/index');

module.exports = {
    get: get,
    getFluorophoreById: getFluorophoreById,
    post: post,
    updateFluorophore: updateFluorophore,
    deleteFluorophore: deleteFluorophore
};

function get(req, res) {
    models.Fluorophore.findAll({}).then(function (fluorophores) {
        res.json(fluorophores);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getFluorophoreById(req, res) {
    models.Fluorophore.findAll({where: {id: req.swagger.params.fluorophoreId.value}, limit: 1}).then(function (fluorophores) {
        if (fluorophores.length > 0)
            res.json(fluorophores[0]);
        else
            res.status(500).json(errors.idDoesNotExit());
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res) {
    var name = req.body.name;

    if (name === undefined || name === null) {
        res.status(500).json(errors.invalidName());
        return;
    }

    models.Fluorophore.findAll({where:{name: name}}).then(function (fluorophores) {
        if (fluorophores != null && fluorophores.length > 0) {
            res.status(500).json(errors.duplicateStrain());
        } else {
            models.Fluorophore.create({
                name: name
            }).then(function (fluorophore) {
                res.json(fluorophore);
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateFluorophore(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Fluorophore.findAll({where:{id: req.body.id}}).then(function (fluorophores) {
        if (fluorophores === null || fluorophores.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var fluorophore = fluorophores[0];

            if (req.body.name === undefined || req.body.name === null || req.body.name.length === 0) {
                res.status(500).json(errors.invalidName());
                return;
            }

            fluorophore.update({
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

function deleteFluorophore(req, res) {
    var fluorophoreParam = req.swagger.params.fluorophoreId;

    if (fluorophoreParam === undefined || fluorophoreParam === null || fluorophoreParam.value === undefined || fluorophoreParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    var fluorophoreId = fluorophoreParam.value;

    models.Fluorophore.findAll({where:{id: fluorophoreId}}).then(function (fluorophores) {
        if (fluorophores === null || fluorophores.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            var fluorophore = fluorophores[0];

            fluorophore.destroy().then(function () {
                res.json({id: fluorophoreId});
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
