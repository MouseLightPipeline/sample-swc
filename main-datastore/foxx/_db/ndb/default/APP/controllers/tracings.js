'use strict';
var _ = require('underscore');
var db = require("org/arangodb").db;
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Tracings = require('../repositories/tracings');
var Tracing = require('../models/tracing');
var controller = new Foxx.Controller(applicationContext);

var tracingIdSchema = joi.string().required()
.description('The id of the tracing')
.meta({allowMultiple: false});

var tracings = new Tracings(
    //applicationContext.collection('tracings'),
    db._collection('tracings'),
    {model: Tracing}
);

/** Lists of all tracings.
 *
 * This function simply returns the list of all Tracing.
 */
controller.get('/', function (req, res) {
  res.json(_.map(tracings.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new tracing.
 *
 * Creates a new tracing. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var tracing = req.parameters.tracing;
  res.json(tracings.save(tracing).forClient());
})
.bodyParam('tracing', {
  description: 'The tracing you want to create',
  type: Tracing
});

/** Reads a tracing.
 *
 * Reads a tracing.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(tracings.byId(id).forClient());
})
.pathParam('id', tracingIdSchema)
.errorResponse(ArangoError, 404, 'The tracing could not be found');

/** Replaces a tracing.
 *
 * Changes a tracing. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var tracing = req.parameters.tracing;
  res.json(tracings.replaceById(id, tracing));
})
.pathParam('id', tracingIdSchema)
.bodyParam('tracing', {
  description: 'The tracing you want your old one to be replaced with',
  type: Tracing
})
.errorResponse(ArangoError, 404, 'The tracing could not be found');

/** Updates a tracing.
 *
 * Changes a tracing. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(tracings.updateById(id, patchData));
})
.pathParam('id', tracingIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your tracing to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The tracing could not be found');

/** Removes a tracing.
 *
 * Removes a tracing.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  tracings.removeById(id);
  res.json({success: true});
})
.pathParam('id', tracingIdSchema)
.errorResponse(ArangoError, 404, 'The tracing could not be found');
