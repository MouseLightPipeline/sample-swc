const config = {
    development: {
        transformService: {
            host: 'localhost',
            port: 5000
        }
    },
    test: {
        transformService: {
            host: 'localhost',
            port: 5000
        }
    },
    production: {
        transformService: {
            host: 'transformapi',
            port: 5000
        }
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
