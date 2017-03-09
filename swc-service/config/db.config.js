const config = {
  "development": {
    "username": "postgres",
    "password": "pgsecret",
    "database": "swc_development",
    "host": "localhost",
    "port": "5433",
    "dialect": "postgres",
    "logging": null
  },
  "test": {
    "username": "postgres",
    "password": "pgsecret",
    "database": "swc_test",
    "host": "swc-db",
    "port": "5432",
    "dialect": "postgres",
    "logging": null
  },
  "production": {
    "username": "postgres",
    "password": "pgsecret",
    "database": "swc_production",
    "host": "swc-db",
    "port": "5432",
    "dialect": "postgres",
    "logging": null
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];
