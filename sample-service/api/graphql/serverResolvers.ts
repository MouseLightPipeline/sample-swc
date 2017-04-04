import {IGraphQLServerContext} from "./serverContext";

const debug = require("debug")("ndb:sample-service:resolvers");

import {IBrainArea} from "../models/brainArea";
import {IRegistrationTransform} from "../models/registrationTransform";
import {IMouseStrain} from "../models/mousestrain";
import {IFluorophore} from "../models/fluorophore";
import {IInjectionVirus} from "../models/injectionVirus";
import {IInjection} from "../models/injection";
import {ISample} from "../models/sample";
import {INeuron} from "../models/neuron";

const resolvers = {
    Query: {
        brainAreas(_, __, context: IGraphQLServerContext): Promise<IBrainArea[]> {
            return context.getBrainAreas();
        },
        mouseStrains(_, __, context: IGraphQLServerContext): Promise<IMouseStrain[]> {
            return context.getMouseStrains();
        },
        fluorophores(_, __, context: IGraphQLServerContext): Promise<IFluorophore[]> {
            return context.getFluorophores();
        },
        injectionViruses(_, __, context: IGraphQLServerContext): Promise<IInjectionVirus[]> {
            return context.getInjectionViruses();
        },
        injections(_, __, context: IGraphQLServerContext): Promise<IInjection[]> {
            return context.getInjections();
        },
        registrationTransforms(_, __, context: IGraphQLServerContext): Promise<IRegistrationTransform[]> {
            return context.getRegistrationTransforms();
        },
        samples(_, __, context: IGraphQLServerContext): Promise<ISample[]> {
            return context.getSamples();
        },
        neurons(_, __, context: IGraphQLServerContext): Promise<INeuron[]> {
            return context.getNeurons();
        }

    },
    Mutation: {}
};

export default resolvers;
