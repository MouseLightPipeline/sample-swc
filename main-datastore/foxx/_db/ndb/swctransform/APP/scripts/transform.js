'use strict';

var argv = applicationContext.argv;

var log = require('console').log;
var error = require('console').error;

var request = require('org/arangodb/request');

var response = request.get(argv[0].url);

if (response.status === 200) {
    log(JSON.parse(response.body));
} else {
    error('Could not acquire transform');
    throw 'Could not acquire transform';
}

//res.json();
