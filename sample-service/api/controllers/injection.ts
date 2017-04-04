const util = require('util');
const errors = require('../helpers/errors');
const models = require('../data-access/databaseConnector').PersistentStorageManager.Instance();

module.exports = {
    get: get,
    getInjectionById: getInjectionById,
    post: post,
    getInjectionsForSample: getInjectionsForSample,
    updateInjection: updateInjection,
    deleteInjection: deleteInjection
};

function get(req, res) {
    models.Injection.findAll({}).then(function (injections) {
        res.json(injections);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getInjectionById(req, res) {
    models.Injection.findAll({where: {id: req.swagger.params.injectionId.value}, limit: 1}).then(function (injections) {
        if (injections.length > 0)
            res.json(injections[0]);
        else
            res.status(500).json(errors.idDoesNotExit());
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getInjectionsForSample(req, res) {
    models.Injection.findAll({where: {sampleId: req.swagger.params.sampleId.originalValue}}).then(function (injections) {
        injections = injections.map((obj) => {
           return obj.id;
        });
        res.json(injections);
    }).catch(function(err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function post(req, res) {
    const sampleId = req.body.sampleId || null;
    const brainAreaId = req.body.brainAreaId || null;
    const injectionVirusId = req.body.injectionVirusId || null;
    const fluorophoreId = req.body.fluorophoreId || null;

    models.Injection.create({
        sampleId: sampleId,
        brainAreaId: brainAreaId,
        injectionVirusId: injectionVirusId,
        fluorophoreId: fluorophoreId
    }).then(function (injection) {
        res.json(injection);
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateInjection(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Injection.findAll({where:{id: req.body.id}}).then(function (injections) {
        if (injections === null || injections.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const injection = injections[0];

            injection.update({
                sampleId: req.body.sampleId,
                brainAreaId: req.body.brainAreaId,
                injectionVirusId: req.body.injectionVirusId,
                fluorophoreId: req.body.fluorophoreId
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

function deleteInjection(req, res) {
    const injectionParam = req.swagger.params.injectionId;

    if (injectionParam === undefined || injectionParam === null || injectionParam.value === undefined || injectionParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    const injectionId = injectionParam.value;

    models.Injection.findAll({where:{id: injectionId}}).then(function (injections) {
        if (injections === null || injections.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const injection = injections[0];

            injection.destroy().then(function () {
                res.json({id: injectionId});
            }).catch(function(err){
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function(err){
        res.status(500).json(errors.sequelizeError(err));
    });
}
