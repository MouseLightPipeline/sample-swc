'use strict';
var db = require("org/arangodb").db;

function dropCollection(name) {
  var collectionName = applicationContext.collectionName(name);
  db._drop(collectionName);
}

dropCollection("samples");
dropCollection("neurons");
dropCollection("brain_regions");
dropCollection("tracings");
