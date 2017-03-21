"use strict";

const util = require("util");
const fs = require("fs"), byline = require("byline");

const app = require("../../app");
const errors = require("../helpers/errors");
const models = require("../models/index");

const apiClient = require("../helpers/transformGraphqlClient").Instance;
// const send = require("../helpers/messageQueue").send;

const debug = require("debug")("ndb:swc-service:upload");

const SOMA_STRUCTURE_IDENTIFIER_INDEX = 1;

module.exports = {
    post: post,
};

let currentStructureMap = {};

function post(req, res) {
    if (!req.app.locals.dbready) {
        return res.status(503).send({
            code: 503,
            message: "Database service unavailable"
        });
    }

    const tmpFile = req.file.path;
    const originalName = req.file.originalname;

    const stream = byline(fs.createReadStream(tmpFile, {encoding: "utf8"}));

    const comments = '';

    const annotator = req.swagger.params.annotator.value || '';

    const neuronId = req.swagger.params.neuronId.value || '';

    const tracingStructureId = req.swagger.params.tracingStructureId.value || '';

    const tracing = {
        filename: originalName,
        annotator: annotator,
        neuronId: neuronId,
        tracingStructureId: tracingStructureId,
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

        const samples = [];

        const metrics = {
            unParentedCount: 0
        };

        stream.on("data", function (line) {
            onData(line, samples, tracing, metrics);
        });

        stream.on("end", function () {
            onComplete(res, tracing, samples, metrics, tmpFile);
        });
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}

function onData(line, samples, tracing, metrics) {
    let data = line.trim();

    if (data.length > 0) {
        if (data[0] === "#") {
            tracing.comments += data + "\n";

            if (data.startsWith("# OFFSET")) {
                const sub = data.substring(9);
                const points = sub.split(/\s/);
                if (points.length === 3) {
                    const x = parseFloat(points[0]);
                    const y = parseFloat(points[1]);
                    const z = parseFloat(points[2]);

                    if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
                        tracing.offsetX = x;
                        tracing.offsetY = y;
                        tracing.offsetZ = z;
                    }
                }
            }
        } else {
            data = data.split(/\s/);
            if (data.length === 7) {
                const parentNumber = parseInt(data[6]);
                if (parentNumber === -1) {
                    metrics.unParentedCount += 1;
                }
                const sample = {
                    sampleNumber: parseInt(data[0]),
                    structureIdentifierId: parentNumber === -1 ? currentStructureMap[SOMA_STRUCTURE_IDENTIFIER_INDEX] : currentStructureMap[parseInt(data[1])],
                    x: parseFloat(data[2]),
                    y: parseFloat(data[3]),
                    z: parseFloat(data[4]),
                    radius: parseFloat(data[5]),
                    parentNumber: parentNumber
                };
                if (isNaN(sample.sampleNumber) || isNaN(sample.parentNumber)) {
                    // console.log("Unexpected line in swc file - not a comment and sample and/or parent number is NaN");
                } else {
                    samples.push(sample);
                }
            }
        }
    }
}

function onComplete(res, tracingData, samples, metrics, tmpFile) {
    // Remove temporary upload
    fs.unlinkSync(tmpFile);

    if (samples.length === 0) {
        res.status(500).json(errors.noSamplesInSwcFile(tracingData.filename));
        return;
    }

    if (metrics.unParentedCount === 0) {
        res.status(500).json(errors.noUnParentedSampleInSwcFile(tracingData.filename));
        return;
    }

    if (metrics.unParentedCount > 1) {
        res.status(500).json(errors.tooManyUnParentedSamplesInSwcFile(tracingData.filename));
        return;
    }

    let tracing = null;

    models.sequelize.transaction(function (t) {
        return models.SwcTracing.create(tracingData, {transaction: t}).then(function (createdTracing) {
            tracing = createdTracing;

            samples.forEach(function (sample) {
                sample.swcTracingId = createdTracing.id;
            });

            return models.SwcTracingNode.bulkCreate(samples, {transaction: t});
        })
    }).then(() => {
        app.broadcast();

        debug(`submitting transform for swc ${tracing.id}`);

        apiClient.transformTracing(tracing.id).then((out) => {
            debug(`successfully created tracing ${out.data.applyTransform.id}`)
        }).catch(err => {
            debug("transform submission failed");
            debug(err);
        });

        return res.status(200).send(tracing);
    }).catch(function (err) {
        res.status(500).json(errors.sequelizeError(err));
    });
}
