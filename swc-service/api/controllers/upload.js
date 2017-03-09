'use strict';

var util = require('util');
var fs = require('fs'), byline = require('byline');
var io = require('../../app.js').io;

var app = require('../../app');
var errors = require('../helpers/errors');
var models = require('../models/index');

const apiClient = require("../helpers/transformGraphqlClient").Instance;
const send = require("../helpers/messageQueue").send;

/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    post: post,
};

var currentStructureMap = {};

function post(req, res) {
    if (!req.app.locals.dbready) {
        return res.status(503).send({
            code: 503,
            message: 'Database service unavailable'
        });
    }

    var tmpFile = req.file.path;
    var originalName = req.file.originalname;

    var stream = byline(fs.createReadStream(tmpFile, {encoding: 'utf8'}));

    var comments = '';

    var annotator = req.swagger.params.annotator.value || '';

    var neuronId = req.swagger.params.neuronId.value || '';

    var structureIdentifierId = req.swagger.params.structureIdentifierId.value || '';

    var tracing = {
        filename: originalName,
        annotator: annotator,
        neuronId: neuronId,
        structureIdentifierId: structureIdentifierId,
        comments: comments,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0
    };

    currentStructureMap = {};

    models.StructureIdentifier.findAll().then((structures) => {
        structures.forEach((obj) => {
            currentStructureMap[obj.value] = obj.id;
        });

        var samples = [];

        stream.on('data', function (line) {
            onData(line, samples, tracing)
        });

        stream.on('end', function () {
            onComplete(res, tracing, samples, tmpFile);
        });
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function onData(line, samples, tracing) {
    //console.log('data');
    var data = line.trim();

    if (data.length > 0) {
        if (data[0] == '#') {
            tracing.comments += data + '\n';

            if (data.startsWith('# OFFSET')) {
                var sub = data.substring(9);
                var points = sub.split(/\s/);
                if (points.length === 3) {
                    var x = parseFloat(points[0]);
                    var y = parseFloat(points[1]);
                    var z = parseFloat(points[2]);

                    if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
                        tracing.offsetX = x;
                        tracing.offsetY = y;
                        tracing.offsetZ = z;
                    }
                }
            }
        } else {
            data = data.split(/\s/);
            if (data.length == 7) {
                var sample = {
                    sampleNumber: parseInt(data[0]),
                    structureIdentifierId: currentStructureMap[parseInt(data[1])],
                    x: parseFloat(data[2]),
                    y: parseFloat(data[3]),
                    z: parseFloat(data[4]),
                    radius: parseFloat(data[5]),
                    parentNumber: parseInt(data[6])
                };
                if (isNaN(sample.sampleNumber) || isNaN(sample.parentNumber)) {
                    // console.log('Unexpected line in swc file - not a comment and sample and/or parent number is NaN');
                } else {
                    samples.push(sample);
                }
            }
        }
    }
}

function onComplete(res, tracingData, samples, tmpFile) {
    // Remove temporary upload
    fs.unlinkSync(tmpFile);

    if (samples.length == 0) {
        res.status(500).json(errors.noSamplesInSwcFile(tracingData.filename));
        return;
    }

    let tracing = null;

    models.sequelize.transaction(function (t) {
        return models.Tracing.create(tracingData, {transaction: t}).then(function (createdTracing) {
            tracing = createdTracing;

            samples.forEach(function (sample) {
                sample.tracingId = createdTracing.id;
            });

            return models.TracingNode.bulkCreate(samples, {transaction: t});
        })
    }).then(function (result) {
        app.broadcast();

        console.log(`submitting transform for ${tracing.id}`);

        apiClient.transformTracing(tracing.id).then((out) => {
            console.log(out);
        }).catch(err => console.log(err));

        //send("Hello World");
        console.log(`returning`);

        return res.status(200).send(tracing);
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}
