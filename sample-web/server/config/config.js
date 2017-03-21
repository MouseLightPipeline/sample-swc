const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';
const service_port = process.env.SAMPLE_SERVICE_PORT || 9641;

const port = 9643;

const config = {
    development: {
        root: rootPath,
        app: {
            name: 'sample-client'
        },
        port: port,
        service: {
            host: 'localhost',
            port: service_port,
            api: 'api/v1'
        }
    },

    test: {
        root: rootPath,
        app: {
            name: 'sample-client'
        },
        port: port,
        service: {
            host: 'sample-api',
            port: service_port,
            api: 'api/v1'
        }
    },
    production: {
        root: rootPath,
        app: {
            name: 'sample-client'
        },
        port: port,
        service: {
            host: 'sample-api',
            port: service_port,
            api: 'api/v1'
        }
    }
};

module.exports = config[env];
