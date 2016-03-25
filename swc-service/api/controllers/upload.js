'use strict';

var util = require('util');

var models = require('../models/index');

var fs = require('fs'), byline = require('byline');

var io = require('../../app.js').io;

/*
 For a controller you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document
 */
module.exports = {
    post: post,
};

function post(req, res) {
  if (!req.app.locals.dbready) {
    return res.status(503).send({code: 503, message: 'Database service unavailable'});
  }
  
  req.file('contents').upload(function (err, uploadedFiles) {
    if (err) {
      console.log(err);
      return res.status(503).send({code: 500, message: 'File upload error', details: err});
    }
    var tmpFile = uploadedFiles[0];
    
    var stream = byline(fs.createReadStream(tmpFile.fd, { encoding: 'utf8' }));

    var comments = '';
    
    var swcFile = {submitter: req.swagger.params.submitter.value, tag: req.swagger.params.tag.value, filename: uploadedFiles[0].filename, comments: comments};

    var samples = []
  
    stream.on('data', function(line) {
      onData(line, samples, comments)
    });
    
    stream.on('end', function() {
      swcFile.comments = comments;
      onComplete(res, swcFile, samples, tmpFile);
    });
  });
}

function onData(line, samples, comments) {
  var data = line.trim();

  if (data.length > 0 ) {
    if (data[0] == '#') {
      comments += res + '\n';
    } else {
      data = data.split(' ');
      if (data.length == 7) {
        samples.push({sampleNumber: parseInt(data[0]), structure: parseInt(data[1]), x: parseFloat(data[2]),y: parseFloat(data[3]),
          z: parseFloat(data[4]), radius: parseFloat(data[5]), parentNumber: parseInt(data[6])});
      }
    }
  }
}

function onComplete(res, swcFile, samples, tmpFile) {
  var file = null;
  
  fs.unlink(tmpFile.fd);

  models.sequelize.transaction(function(t) {
    return models.SwcFile.create(swcFile, {transaction: t}).then(function(newFile) {
      file = newFile;
      samples.forEach(function(sample) {
        sample.fileId = newFile.id;
      });
      models.NeuronSample.bulkCreate(samples);
    })
  }).then(function(result) {
    models.SwcFile.count().then(function(val) { io.emit('file_count', val)});;
    models.NeuronSample.count().then(function(val) { io.emit('sample_count', val)});;
    return res.status(200).send(file);
  }).catch(function(err) {
    console.log(err);
    return res.status(500).send({code: 500, message: 'File upload error', details: err});
  });      
}
