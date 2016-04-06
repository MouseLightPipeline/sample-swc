'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Neurons = require('../repositories/neurons');
var Neuron = require('../models/neuron');
var controller = new Foxx.Controller(applicationContext);

var neuronIdSchema = joi.string().required()
.description('The id of the neuron')
.meta({allowMultiple: false});

var neurons = new Neurons(
  applicationContext.collection('neurons'),
  {model: Neuron}
);

/** Lists of all neurons.
 *
 * This function simply returns the list of all Neuron.
 */
controller.get('/', function (req, res) {
  res.json(_.map(neurons.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new neuron.
 *
 * Creates a new neuron. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var neuron = req.parameters.neuron;
  res.json(neurons.save(neuron).forClient());
})
.bodyParam('neuron', {
  description: 'The neuron you want to create',
  type: Neuron
});

/** Reads a neuron.
 *
 * Reads a neuron.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(neurons.byId(id).forClient());
})
.pathParam('id', neuronIdSchema)
.errorResponse(ArangoError, 404, 'The neuron could not be found');

/** Replaces a neuron.
 *
 * Changes a neuron. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var neuron = req.parameters.neuron;
  res.json(neurons.replaceById(id, neuron));
})
.pathParam('id', neuronIdSchema)
.bodyParam('neuron', {
  description: 'The neuron you want your old one to be replaced with',
  type: Neuron
})
.errorResponse(ArangoError, 404, 'The neuron could not be found');

/** Updates a neuron.
 *
 * Changes a neuron. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
  var id = req.urlParameters.id;
  var patchData = req.parameters.patch;
  res.json(neurons.updateById(id, patchData));
})
.pathParam('id', neuronIdSchema)
.bodyParam('patch', {
  description: 'The patch data you want your neuron to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The neuron could not be found');

/** Removes a neuron.
 *
 * Removes a neuron.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  neurons.removeById(id);
  res.json({success: true});
})
.pathParam('id', neuronIdSchema)
.errorResponse(ArangoError, 404, 'The neuron could not be found');
