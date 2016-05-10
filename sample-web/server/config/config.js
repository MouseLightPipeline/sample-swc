var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var service_port = process.env.SWC_SERVICE_PORT || 9641;

var port = 9643;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sample-web-dev'
    },
    port: port,
    service: 'localhost:' + service_port.toString()
  },

  test: {
    root: rootPath,
    app: {
      name: 'sample-web-test'
    },
    port: port,
    service: 'sampleservice:' + service_port.toString()
  },

  production: {
    root: rootPath,
    app: {
      name: 'sample-web'
    },
    port: port,
    service: 'sampleservice:' + service_port.toString()
  }
};

module.exports = config[env];
