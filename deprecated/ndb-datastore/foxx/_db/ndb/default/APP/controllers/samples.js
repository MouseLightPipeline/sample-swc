'use strict';
var _ = require('underscore');
var db = require("org/arangodb").db;
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Samples = require('../repositories/samples');
var Sample = require('../models/sample');
var controller = new Foxx.Controller(applicationContext);

var sampleIdSchema = joi.string().required()
.description('The id of the sample')
.meta({allowMultiple: false});

var samples = new Samples(
    //applicationContext.collection('samples'),
    db._collection('samples'),
    {model: Sample}
);

/** Lists of all samples.
*
* This function simply returns the list of all Sample.
*/
controller.get('/', function (req, res) {
    res.json(_.map(samples.all(), function (model) {
        return model.forClient();
    }));
});

/** Creates a new sample.
*
* Creates a new sample. The information has to be in the
* requestBody.
*/
controller.post('/', function (req, res) {
    var sample = req.parameters.sample;
    res.json(samples.save(sample).forClient());
})
.bodyParam('sample', {
    description: 'The sample you want to create',
    type: Sample
});

/** Reads a sample.
*
* Reads a sample.
*/
controller.get('/:id', function (req, res) {
    var id = req.urlParameters.id;
    res.json(samples.byId(id).forClient());
})
.pathParam('id', sampleIdSchema)
.errorResponse(ArangoError, 404, 'The sample could not be found');

/** Replaces a sample.
*
* Changes a sample. The information has to be in the
* requestBody.
*/
controller.put('/:id', function (req, res) {
    var id = req.urlParameters.id;
    var sample = req.parameters.sample;
    res.json(samples.replaceById(id, sample));
})
.pathParam('id', sampleIdSchema)
.bodyParam('sample', {
    description: 'The sample you want your old one to be replaced with',
    type: Sample
})
.errorResponse(ArangoError, 404, 'The sample could not be found');

/** Updates a sample.
*
* Changes a sample. The information has to be in the
* requestBody.
*/
controller.patch('/:id', function (req, res) {
    var id = req.urlParameters.id;
    var patchData = req.parameters.patch;
    res.json(samples.updateById(id, patchData));
})
.pathParam('id', sampleIdSchema)
.bodyParam('patch', {
    description: 'The patch data you want your sample to be updated with',
    type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The sample could not be found');

/** Removes a sample.
*
* Removes a sample.
*/
controller.delete('/:id', function (req, res) {
    var id = req.urlParameters.id;
    samples.removeById(id);
    res.json({success: true});
})
.pathParam('id', sampleIdSchema)
.errorResponse(ArangoError, 404, 'The sample could not be found');
