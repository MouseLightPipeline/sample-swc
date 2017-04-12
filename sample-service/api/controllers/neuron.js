"use strict";

const util = require("util");
const app = require("../../app");
const errors = require("../helpers/errors");
const models = require('../data-access/databaseConnector').PersistentStorageManager.Instance();

module.exports = {
    get: get,
    post: post,
    getNeuronById: getNeuronById,
    getNeuronsForInjection: getNeuronsForInjection,
    getNeuronsForSample: getNeuronsForSample,
    updateNeuron: updateNeuron,
    deleteNeuron: deleteNeuron
};

function get(req, res) {
    models.Neuron.findAll().then(neurons => {
        res.json(neurons);
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getNeuronById(req, res) {
    models.Neuron.findAll({
        where: {id: req.swagger.params.neuronId.value},
        limit: 1
    }).then(function (neurons) {
        if (neurons.length > 0)
            res.json(neurons[0]);
        else
            res.status(500).json(errors.idDoesNotExit());
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getNeuronsForInjection(req, res) {
    models.Neuron.findAll({where: {injectionId: req.swagger.params.injectionId.originalValue}}).then(function (neurons) {
        res.json(neurons);
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function getNeuronsForSample(req, res) {
    models.Injection.findAll({where: {sampleId: req.swagger.params.sampleId.originalValue}}).then(function (injections) {
        injections = injections.map((obj) => {
            return obj.id;
        });

        if (injections.length > 0) {
            models.Neuron.findAll({where: {injectionId: {$in: injections}}}).then(function (neurons) {
                res.json(neurons);
            }).catch(function (err) {
                res.status(500).json(errors.sequelizeError(err));
            });
        } else {
            res.json([]);
        }
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });

}

function post(req, res) {
    if (req.body.idNumber === undefined || req.body.idNumber === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Neuron.findAll({where: {idString: req.body.idString}}).then(function (neurons) {
        if (neurons != null && neurons.length > 0) {
            res.status(500).json(errors.duplicateNeuron());
        } else {
            create(req.body, res);
        }
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function create(body, res) {
    const idNumber = body.idNumber || 0;
    const idString = body.idString || "";
    const injectionId = body.injectionId || null;
    const brainAreaId = body.brainAreaId || null;
    const tag = body.tag || "";
    const keywords = body.keywords || "";
    const x = body.x || 0;
    const y = body.y || 0;
    const z = body.z || 0;

    models.Neuron.create({
        idNumber,
        idString,
        tag,
        keywords,
        injectionId,
        brainAreaId,
        x,
        y,
        z
    }).then(function (neuron) {
        res.json(neuron);
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function updateNeuron(req, res) {
    if (req.body.id === undefined || req.body.id === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    models.Neuron.findAll({where: {id: req.body.id}}).then(function (neurons) {
        if (neurons === null || neurons.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const neuron = neurons[0];

            neuron.update({
                tag: req.body.tag,
                keywords: req.body.keywords,
                idString: req.body.idString,
                injectionId: req.body.injectionId,
                brainAreaId: req.body.brainAreaId,
                x: req.body.x,
                y: req.body.y,
                z: req.body.z
            }).then(function (updated) {
                res.json(updated);
            }).catch(function (err) {
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function deleteNeuron(req, res) {
    const neuronParam = req.swagger.params.neuronId;

    if (neuronParam === undefined || neuronParam === null || neuronParam.value === undefined || neuronParam.value === null) {
        res.status(500).json(errors.invalidIdNumber());
        return;
    }

    const neuronId = neuronParam.value;

    models.Neuron.findAll({where: {id: neuronId}}).then(function (neurons) {
        if (neurons === null || neurons.length === 0) {
            res.status(500).json(errors.idDoesNotExit());
        } else {
            const neuron = neurons[0];

            neuron.destroy().then(function () {
                res.json({id: neuronId});
            }).catch(function (err) {
                res.status(500).json(errors.sequelizeError(err));
            });
        }
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}
