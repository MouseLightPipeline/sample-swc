"use strict";

const Codes = {
    DATABASE_ERROR: {
        code: 1001,
        message: "There was an error using the database."
    },
    INVALID_ID_NUMBER: {
        code: 2001,
        message: "Id number can not be empty and must be an integer."
    },
    INVALID_NAME: {
        code: 2002,
        message: "Id number can not be empty and must be an integer."
    },
    DUPLICATE_SAMPLE_ID: {
        code: 2101,
        message: "A sample with that id number already exists."
    },
    DUPLICATE_NEURON_ID: {
        code: 2201,
        message: "A neuron with that id number already exists."
    },
    DUPLICATE_INJECTION: {
        code: 2301,
        message: "An injection location with that name number already exists."
    },
    // Upload/file submission
    NO_SAMPLES: {
        code: 5001,
        message: "There are no recognizable nodes defined in "
    },
    // Upload/file submission
    NO_UN_PARENTED_SAMPLES: {
        code: 5002,
        message: "There are no un-parented (root) nodes defined  in "
    },
    // Upload/file submission
    TOO_MANY_UN_PARENTED_SAMPLES: {
        code: 5003,
        message: "There are multiple un-parented (root) nodes defined in "
    }
};

function sequelizeError(err) {
    let error = Codes.DATABASE_ERROR;

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

function noSamplesInSwcFile(filename) {
    return {
        code: Codes.NO_SAMPLES.code,
        message: Codes.NO_SAMPLES.message + filename
    };
}

function noUnParentedSampleInSwcFile(filename) {
    return {
        code: Codes.NO_UN_PARENTED_SAMPLES.code,
        message: Codes.NO_UN_PARENTED_SAMPLES.message + filename
    };
}

function tooManyUnParentedSamplesInSwcFile(filename) {
    return {
        code: Codes.TOO_MANY_UN_PARENTED_SAMPLES.code,
        message: Codes.TOO_MANY_UN_PARENTED_SAMPLES.message + filename
    };
}

module.exports = {
    Codes: Codes,
    sequelizeError: sequelizeError,
    invalidIdNumber: invalidIdNumber,
    invalidName: invalidName,
    duplicateSample: duplicateSample,
    duplicateNeuron: duplicateNeuron,
    duplicateInjection: duplicateInjection,
    noSamplesInSwcFile: noSamplesInSwcFile,
    noUnParentedSampleInSwcFile: noUnParentedSampleInSwcFile,
    tooManyUnParentedSamplesInSwcFile: tooManyUnParentedSamplesInSwcFile
};
