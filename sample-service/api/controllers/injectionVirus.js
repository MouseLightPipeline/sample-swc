'use strict';

const util = require('util');
const app = require('../../app');
const errors = require('../helpers/errors');
const models = require('../data-access/databaseConnector').PersistentStorageManager.Instance();

module.exports = {
    get: get,
    getInjectionVirusById: getInjectionVirusById,
    post: post,
    updateVirus: updateVirus,
    deleteVirus: deleteVirus
};

function get(req, res) {
    models.InjectionVirus.findAll({}).then(function (viruses) {
        res.json(viruses);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getInjectionVirusById(req, res) {
    models.InjectionVirus.findAll({where: {id: req.swagger.params.virusId.value}, limit: 1}).then(function (virus) {
        if (virus.length > 0)
            res.json(virus[0]);
        else
            res.status(500).json({message: 'bad id'});
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res) {
    if (req.body.name === undefined || req.body.name === null) {
        res.status(500).json(errors.invalidName());
        return;
    }

    models.InjectionVirus.findAll({where:{name: req.body.name}}).then(function (virus) {
        if (virus != null && virus.length > 0) {
            res.status(500).json(errors.duplicateVirus());
        } else {
            models.InjectionVirus.create({
                name: req.body.name,
            }).then(function (virus) {
                res.json(virus);
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateVirus(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.InjectionVirus.findAll({where:{id: req.body.id}}).then(function (viruses) {
        if (viruses === null || viruses.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const virus = viruses[0];

            if (req.body.name === undefined || req.body.name === null || req.body.name.length === 0) {
                res.status(500).json(errors.invalidName());
                return;
            }

            virus.update({
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

function deleteVirus(req, res) {
    const virusParam = req.swagger.params.virusId;

    if (virusParam === undefined || virusParam === null || virusParam.value === undefined || virusParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    const virusId = virusParam.value;

    models.InjectionVirus.findAll({where:{id: virusId}}).then(function (viruses) {
        if (viruses === null || viruses.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const virus = viruses[0];

            virus.destroy().then(function () {
                res.json({id: virusId});
                app.broadcast();
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
