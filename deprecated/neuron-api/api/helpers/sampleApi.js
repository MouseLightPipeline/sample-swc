'use strict';

var restClient = require('node-rest-client').Client;

var client = new restClient();

module.exports = {
    requestNeuron: requestNeuron,
    requestNeurons: requestNeurons
};

function requestNeuron(id) {
    return new Promise((resolve, reject) => {
        client.get('http://localhost:9641/api/v1/neurons/' + id, resolve).on('error', reject);
    });
}

function requestNeurons() {
    return new Promise((resolve, reject) => {
        client.get('http://localhost:9641/api/v1/neurons', resolve).on('error', reject);
    });
}
