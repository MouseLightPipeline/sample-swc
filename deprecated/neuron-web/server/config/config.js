var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var api_port = process.env.NEURON_API_PORT || 9661;

var port = 9663;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'neuron-web-dev'
    },
    port: port,
    service: {
        host: 'localhost',
        port: api_port,
        api: 'api/v1'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'neuron-web-test'
    },
    port: port,
    service: {
        host: 'neuronservice',
        port: api_port,
        api: 'api/v1'
    }
  },
  production: {
    root: rootPath,
    app: {
      name: 'neuron-web'
    },
    port: port,
    service: {
        host: 'neuronservice',
        port: api_port,
        api: 'api/v1'
    }
  }
};

module.exports = config[env];
