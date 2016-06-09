var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var service_port = process.env.SAMPLE_SERVICE_PORT || 9641;
var status_port = process.env.SAMPLE_STATUS_PORT || 9642;

var port = 9643;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sample-web-dev'
    },
    port: port,
    service: {
        host: 'localhost',
        port: service_port,
        api: 'api/v1'
    },
    status: {
        host: 'localhost',
        port: status_port,
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'sample-web-test'
    },
    port: port,
    service: {
        host: 'sampleservice',
        port: service_port,
        api: 'api/v1'
    },
    status: {
        host: 'samplestatus',
        port: status_port,
    }
  },
  production: {
    root: rootPath,
    app: {
      name: 'sample-web'
    },
    port: port,
    service: {
        host: 'sampleservice',
        port: service_port,
        api: 'api/v1'
    },
    status: {
        host: 'samplestatus',
        port: status_port,
    }
  }
};

module.exports = config[env];
