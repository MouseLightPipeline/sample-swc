var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var service_port = process.env.MAIN_SERVICE_PORT || 8529;

var port = 9663;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'main-web-dev'
    },
    port: port,
    service: 'database:' + service_port.toString()
  },

  test: {
    root: rootPath,
    app: {
      name: 'main-web-test'
    },
    port: port,
    service: 'database:' + service_port.toString()
  },

  production: {
    root: rootPath,
    app: {
      name: 'main-web'
    },
    port: port,
    service: 'database:' + service_port.toString()
  }
};

module.exports = config[env];
