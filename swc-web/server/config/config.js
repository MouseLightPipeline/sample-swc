var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var service_port = process.env.SWC_SERVICE_PORT || 9651;

var port = 9653;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'swc-web-dev'
    },
    port: port,
    service: 'localhost:' + service_port.toString()
  },

  test: {
    root: rootPath,
    app: {
      name: 'swc-web-test'
    },
    port: port,
    service: 'swcservice:' + service_port.toString()
  },

  production: {
    root: rootPath,
    app: {
      name: 'swc-web'
    },
    port: port,
    service: 'swcservice:' + service_port.toString()
  }
};

module.exports = config[env];
