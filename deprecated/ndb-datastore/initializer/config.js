var path = require('path');

var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var db_port = process.env.MAIN_DB_PORT || 8529;

var config = {
    development: {
        root: rootPath,
        user: 'root',
        password: 'arsecret',
        service: '192.168.6.134:' + db_port.toString(),
        sleep: 5000
    },

    test: {
        root: rootPath,
        user: 'root',
        password: 'arsecret',
        service: 'database:' + db_port.toString(),
        sleep: 30000
    },

    production: {
        root: rootPath,
        user: 'root',
        password: 'arsecret',
        service: 'database:' + db_port.toString(),
        sleep: 30000
    }
};

module.exports = config[env];
