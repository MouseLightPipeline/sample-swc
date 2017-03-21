const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";
const service_port = process.env.SWC_SERVICE_PORT || 9651;
const sample_service_port = process.env.SAMPLE_SERVICE_PORT || 9641;

const port = 9653;

const config = {
    development: {
        root: rootPath,
        app: {
            name: "swc-client"
        },
        port: port,
        service: {
            host: "localhost",
            port: service_port,
            api: "api/v1"
        },
        sampleService: {
            host: "localhost",
            port: sample_service_port,
            api: "api/v1"
        }
    },

    test: {
        root: rootPath,
        app: {
            name: "swc-client"
        },
        port: port,
        service: {
            host: "swc-api",
            port: service_port,
            api: "api/v1"
        },
        sampleService: {
            host: "sample-api",
            port: sample_service_port,
            api: "api/v1"
        }
    },

    production: {
        root: rootPath,
        app: {
            name: "swc-client"
        },
        port: port,
        service: {
            host: "swc-api",
            port: service_port,
            api: "api/v1"
        },
        sampleService: {
            host: "sample-api",
            port: sample_service_port,
            api: "api/v1"
        }
    }
};

module.exports = config[env];
