'use strict';
var _ = require('underscore');
var db = require("org/arangodb").db;
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Brain_regions = require('../repositories/brain_regions');
var Brain_region = require('../models/brain_region');
var controller = new Foxx.Controller(applicationContext);

var brain_regionIdSchema = joi.string().required()
.description('The id of the brain_region')
.meta({allowMultiple: false});

var brain_regions = new Brain_regions(
    //  applicationContext.collection('brain_regions'),
    db._collection('brain_regions'),
    {model: Brain_region}
);

/** Lists of all brain_regions.
 *
 * This function simply returns the list of all Brain_region.
 */
controller.get('/', function (req, res) {
  res.json(_.map(brain_regions.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new brain_region.
 *
 * Creates a new brain_region. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var brain_region = req.parameters.brain_region;
  res.json(brain_regions.save(brain_region).forClient());
})
.bodyParam('brain_region', {
  description: 'The brain_region you want to create',
  type: Brain_region
});

/** Reads a brain_region.
 *
 * Reads a brain_region.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(brain_regions.byId(id).forClient());
})
.pathParam('id', brain_regionIdSchema)
.errorResponse(ArangoError, 404, 'The brain_region could not be found');

/** Replaces a brain_region.
 *
 * Changes a brain_region. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var brain_region = req.parameters.brain_region;
  res.json(brain_regions.replaceById(id, brain_region));
})
.pathParam('id', brain_regionIdSchema)
.bodyParam('brain_region', {
  description: 'The brain_region you want your old one to be replaced with',
  type: Brain_region
})
.errorResponse(ArangoError, 404, 'The brain_region could not be found');

/** Updates a brain_region.
 *
 * Changes a brain_region. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(brain_regions.updateById(id, patchData));
})
.pathParam('id', brain_regionIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your brain_region to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The brain_region could not be found');

/** Removes a brain_region.
 *
 * Removes a brain_region.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  brain_regions.removeById(id);
  res.json({success: true});
})
.pathParam('id', brain_regionIdSchema)
.errorResponse(ArangoError, 404, 'The brain_region could not be found');
