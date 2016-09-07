var config = require('./config.js');
var arango = require('arangojs');

var at = '@';

// Although generally robust to waiting for the db container, no reason to rush.


setTimeout(() => {
    var connection = 'http://' + config.user + ':' + config.password + at + config.service;
    console.log('Attempting connection to ' + connection);
    db = new arango.Database(connection);
    connect();
}, config.sleep);

function connect() {
    db.listDatabases().then(
        () => {
            console.log('Connected to db instance');
            create();
        },
        err => {
            var code = err.errno || null;
            
            if (code) {
                // Connection refused, keep trying.
                console.error(code);
                setTimeout(() => connect(), 5000);
            } else {
                code = err.code || null;
                if (code) {
                    // Typically a reset during initialization
                    console.error(code);
                    setTimeout(() => connect(), 5000);
                } else {
                    console.error(err);
                    setTimeout(() => connect(), 10000);
                }
            }
        }
    );
}

function create() {
    db.createDatabase('ndb', [{username: config.user, passwd: config.password, active: true}]).then(
        () => {
            console.log('Database created');
        },
        err => {
            var name = err.name || '';

            if (name === 'ArangoError' && err.errorNum === 1207) {
                // Database exists, done.
                console.log('Database exists.');
            } else {
                // Try again
                console.log(err);
                setTimeout(() => connect(), 10000);
            }
        }
    );
}
