'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var Histories = require('../repositories/histories');
var History = require('../models/history');
var controller = new Foxx.Controller(applicationContext);

var historyIdSchema = joi.string().required()
.description('The id of the history')
.meta({allowMultiple: false});

var histories = new Histories(
  applicationContext.collection('histories'),
  {model: History}
);

/** Lists of all neurons.
 *
 * This function simply returns the list of all Neuron.
 */
controller.get('/', function (req, res) {
  res.json(_.map(histories.all(), function (model) {
    return model.forClient();
  }));
});

/** Reads a neuron.
 *
 * Reads a neuron.
 */
controller.get('/:id', function (req, res) {
  var id = req.urlParameters.id;
  res.json(histories.byId(id).forClient());
})
.pathParam('id', historyIdSchema)
.errorResponse(ArangoError, 404, 'The history could not be found');

/** Removes a neuron.
 *
 * Removes a neuron.
 */
controller.delete('/:id', function (req, res) {
  var id = req.urlParameters.id;
  histories.removeById(id);
  res.json({success: true});
})
.pathParam('id', historyIdSchema)
.errorResponse(ArangoError, 404, 'The history could not be found');
