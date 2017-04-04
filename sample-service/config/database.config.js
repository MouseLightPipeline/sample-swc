"use strict";
module.exports = {
    "development": {
        "username": "postgres",
        "password": "pgsecret",
        "database": "samples_development",
        "host": "localhost",
        "port": "5432",
        "dialect": "postgres",
        "logging": null
    },
    "test": {
        "username": "postgres",
        "password": "pgsecret",
        "database": "samples_test",
        "host": "sample-db",
        "port": "5432",
        "dialect": "postgres",
        "logging": null
    },
    "production": {
        "username": "postgres",
        "password": "pgsecret",
        "database": "samples_production",
        "host": "sample-db",
        "port": "5432",
        "dialect": "postgres",
        "logging": null
    }
};
