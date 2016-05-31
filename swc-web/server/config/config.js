var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var service_port = process.env.SWC_SERVICE_PORT || 9651;
var status_port = process.env.SWC_STATUS_PORT || 9652;
var sample_service_port = process.env.SAMPLE_SERVICE_PORT || 9641;

var port = 9653;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'swc-web-dev'
    },
    port: port,
    service: {
        host: 'localhost',
        port: service_port.toString(),
        api: 'api/v1'
    },
    status: {
        host: 'localhost',
        port: status_port.toString(),
    },
    sampleService: {
        host: 'localhost',
        port: sample_service_port.toString(),
        api: 'api/v1'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'swc-web-test'
    },
    port: port,
    service: {
        host: 'swcservice',
        port: service_port.toString(),
        api: 'api/v1'
    },
    status: {
        host: 'swcstatus',
        port: status_port.toString(),
    },
    sampleService: {
        host: 'samplestatus',
        port: sample_service_port.toString(),
        api: 'api/v1'
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'swc-web'
    },
    port: port,
    service: {
        host: 'swcservice',
        port: service_port.toString(),
        api: 'api/v1'
    },
    status: {
        host: 'swcstatus',
        port: status_port.toString(),
    },
    sampleService: {
        host: 'samplestatus',
        port: sample_service_port.toString(),
        api: 'api/v1'
    }
  }
};

module.exports = config[env];
