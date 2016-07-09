'use strict';

var Codes = {
    // Database
    DATABASE_ERROR: {
        code: 1001,
        message: 'There was an error using the database.'
    },
    // Creating objects - parameters
    INVALID_ID_NUMBER: {
        code: 2001,
        message: 'Id number can not be empty and must be an integer.'
    },
    INVALID_NAME: {
        code: 2002,
        message: 'Id number can not be empty and must be an integer.'
    },
    DUPLICATE_SAMPLE_ID: {
        code: 2101,
        message: 'A sample with that id number already exists.'
    },
    DUPLICATE_NEURON_ID: {
        code: 2201,
        message: 'A neuron with that id number already exists.'
    },
    DUPLICATE_INJECTION: {
        code: 2301,
        message: 'An injection location with that name already exists.'
    },
    DUPLICATE_REGISTRATION: {
        code: 2401,
        message: 'A registration transform with that name already exists.'
    },
    DUPLICATE_VIRUS: {
        code: 2501,
        message: 'A virus with that name already exists.'
    },
    DUPLICATE_STRAIN: {
        code: 2601,
        message: 'A strain with that name already exists for that virus.'
    }
};

function sequelizeError(err) {
    var error = Codes.DATABASE_ERROR;
    error.database = {
        errorMessage: err.message,
        errorName: err.name
    };
    
    return error;
}

function invalidIdNumber() {
    return Codes.INVALID_ID_NUMBER;
}

function invalidName() {
    return Codes.INVALID_NAME;
}

function duplicateSample() {
    return Codes.DUPLICATE_SAMPLE_ID;
}

function duplicateNeuron() {
    return Codes.DUPLICATE_NEURON_ID;
}

function duplicateInjection() {
    return Codes.DUPLICATE_INJECTION;
}

function duplicateRegistration() {
    return Codes.DUPLICATE_REGISTRATION;
}

function duplicateVirus() {
    return Codes.DUPLICATE_VIRUS;
}

function duplicateStrain() {
    return Codes.DUPLICATE_STRAIN;
}

module.exports = {
    Codes: Codes,
    sequelizeError: sequelizeError,
    invalidIdNumber: invalidIdNumber,
    invalidName: invalidName,
    duplicateSample: duplicateSample,
    duplicateNeuron: duplicateNeuron,
    duplicateInjection: duplicateInjection,
    duplicateRegistration: duplicateRegistration,
    duplicateVirus: duplicateVirus,
    duplicateStrain: duplicateStrain
};
