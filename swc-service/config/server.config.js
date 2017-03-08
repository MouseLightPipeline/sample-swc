const config = {
    development: {
        transformService: {
            host: 'localhost',
            port: 9661
        }
    },
    test: {
        transformService: {
            host: 'localhost',
            port: 9661
        }
    },
    production: {
        transformService: {
            host: 'transform-api',
            port: 9661
        }
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
