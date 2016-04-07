'use strict';

var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var controller = new Foxx.Controller(applicationContext);
var env = process.env.NODE_ENV || 'development';

var host = 'swcservice';

if (env === 'development') {
    host = applicationContext.configuration.localSwcService;
}

/** Start a new transform operation.
*
* This function starts a new transform from the SWC database
*/
controller.post('/', function (req, res) {
    var queue = Foxx.queues.create('swc');

    queue.push(
        {
            mount :"/swctransform",
            name: "transform"
        },
        {
            url: 'http://' + host + ':9651' + '/api/v1/'
        }
    );
    
    res.json([]);
});
