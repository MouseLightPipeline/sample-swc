'use strict';

var util = require('util');
var fs = require('fs'), byline = require('byline');
var io = require('../../app.js').io;

var app = require('../../app');
var errors = require('../helpers/errors');
var models = require('../models/index');

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
        return res.status(503).send({code: 503, message: 'Database service unavailable'});
    }
  
    req.file('contents').upload(function (err, uploadedFiles) {
        if (err) {
            console.log(err);
            return res.status(503).send({code: 500, message: 'File upload error', details: err});
        }
        
        if (!uploadedFiles[0]) {
            return res.status(503).send({code: 500, message: 'File upload error', details: 'no file attached'});
        }
    
        var tmpFile = uploadedFiles[0];
    
        var stream = byline(fs.createReadStream(tmpFile.fd, { encoding: 'utf8' }));

        var comments = '';
    
        var annotator = req.swagger.params.annotator.value || '';

        var neuronId = req.swagger.params.neuronId.value || '';
    
        var tracing = {
            filename: uploadedFiles[0].filename,
            annotator: annotator,
            lengthMicrometers: 0,
            neuronId: neuronId,
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
  
            stream.on('data', function(line) {
                onData(line, samples, comments)
            });
    
            stream.on('end', function() {
                tracing.comments = comments;
                onComplete(res, tracing, samples, tmpFile);
            });
        }).catch(function(err){
            res.status(500).json(errors.sequelizeError(err));
        });        
    });
}

function onData(line, samples, comments) {
    var data = line.trim();

    if (data.length > 0 ) {
        if (data[0] == '#') {
            comments += data + '\n';
        } else {
            data = data.split(' ');
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
                    console.log('Unexpected line in swc file - not a comment and sample and/or parent number is NaN');
                } else {
                    samples.push(sample);
                }
            }
        }
    }
}

function onComplete(res, tracingData, samples, tmpFile) {
  
    // remove temporary upload
    fs.unlink(tmpFile.fd);
    
    if (samples.length == 0) {
        res.status(500).json(errors.noSamplesInSwcFile(tmpFile.filename));
        return;
    }
    
    var tracing = null;
    
    models.sequelize.transaction(function(t) {
        return models.Tracing.create(tracingData, {transaction: t}).then(function(createdTracing) {
            tracing = createdTracing;
            samples.forEach(function(sample) {
                sample.tracingId = tracing.id;
            });
            models.TracingNode.bulkCreate(samples);
        })
    }).then(function(result) {
        app.broadcast();
        return res.status(200).send(tracing);
    }).catch(function(err) {
        res.status(500).json(errors.sequelizeError(err));
    });      
}
