import {IMouseStrain} from "../models/mousestrain";
const debug = require("debug")("ndb:sample-service:context");

import {PersistentStorageManager} from "../data-access/databaseConnector";
import {IBrainArea} from "../models/brainArea";
import {IRegistrationTransform} from "../models/registrationTransform";
import {IFluorophore} from "../models/fluorophore";
import {IInjectionVirus} from "../models/injectionVirus";
import {IInjection} from "../models/injection";
import {ISample} from "../models/sample";
import {INeuron} from "../models/neuron";

export interface IGraphQLServerContext {
    getBrainAreas(): Promise<IBrainArea[]>;
    getMouseStrains(): Promise<IMouseStrain[]>;
    getFluorophores(): Promise<IFluorophore[]>;
    getInjectionViruses(): Promise<IInjectionVirus[]>;
    getInjections(): Promise<IInjection[]>;
    getRegistrationTransforms(): Promise<IRegistrationTransform[]>;
    getSamples(): Promise<ISample[]>;
    getNeurons(): Promise<INeuron[]>;
}

export class GraphQLServerContext implements IGraphQLServerContext {
    private _storageManager = PersistentStorageManager.Instance();

    public async getBrainAreas(): Promise<IBrainArea[]> {
        return this._storageManager.BrainArea.findAll({});
    }

    public async getMouseStrains(): Promise<IMouseStrain[]> {
        return this._storageManager.MouseStrain.findAll({});
    }

    public async getFluorophores(): Promise<IFluorophore[]> {
        return this._storageManager.Fluorophore.findAll({});
    }

    public async getInjectionViruses(): Promise<IInjectionVirus[]> {
        return this._storageManager.InjectionVirus.findAll({});
    }

    public async getInjections(): Promise<IInjection[]> {
        return this._storageManager.Injection.findAll({});
    }

    public async getRegistrationTransforms(): Promise<IRegistrationTransform[]> {
        return this._storageManager.RegistrationTransform.findAll({});
    }

    public async getSamples(): Promise<ISample[]> {
        return this._storageManager.Sample.findAll({});
    }

    public async getNeurons(): Promise<INeuron[]> {
        return this._storageManager.Neuron.findAll({});
    }
}
