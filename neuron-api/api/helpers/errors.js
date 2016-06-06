'use strict'

module.exports = {
    Codes: Codes,
    sequelizeError: sequelizeError
}

var Codes = {
    // Database
    DATABASE_ERROR: {
        code: 1001,
        message: 'There was an error using the database.'
    }
};

function sequelizeError(err) {
    var error = Codes.DATABASE_ERROR;
    error.database = {
        errorMessage: err.message,
        errorName: err.name
    }
    
    return error;
}
