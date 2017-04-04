"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ndb:sample-service:resolvers");
const resolvers = {
    Query: {
        brainAreas(_, __, context) {
            return context.getBrainAreas();
        },
        mouseStrains(_, __, context) {
            return context.getMouseStrains();
        },
        fluorophores(_, __, context) {
            return context.getFluorophores();
        },
        injectionViruses(_, __, context) {
            return context.getInjectionViruses();
        },
        injections(_, __, context) {
            return context.getInjections();
        },
        registrationTransforms(_, __, context) {
            return context.getRegistrationTransforms();
        },
        samples(_, __, context) {
            return context.getSamples();
        },
        neurons(_, __, context) {
            return context.getNeurons();
        }
    },
    Mutation: {}
};
exports.default = resolvers;
//# sourceMappingURL=serverResolvers.js.map