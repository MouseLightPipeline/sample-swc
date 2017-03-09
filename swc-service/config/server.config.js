const config = {
    development: {
        transformService: {
            host: 'localhost',
            port: 9661
        },
        messageQueue: {
            host: "localhost",
        }
    },
    test: {
        transformService: {
            host: 'transform-api',
            port: 9661
        },
        messageQueue: {
            host: "message-queue",
        }
    },
    production: {
        transformService: {
            host: 'transform-api',
            port: 9661
        },
        messageQueue: {
            host: "message-queue",
        }
    }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
