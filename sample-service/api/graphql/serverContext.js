"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ndb:sample-service:context");
const databaseConnector_1 = require("../data-access/databaseConnector");
class GraphQLServerContext {
    constructor() {
        this._storageManager = databaseConnector_1.PersistentStorageManager.Instance();
    }
    getBrainAreas() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.BrainArea.findAll({});
        });
    }
    getMouseStrains() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.MouseStrain.findAll({});
        });
    }
    getFluorophores() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.Fluorophore.findAll({});
        });
    }
    getInjectionViruses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.InjectionVirus.findAll({});
        });
    }
    getInjections() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.Injection.findAll({});
        });
    }
    getRegistrationTransforms() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.RegistrationTransform.findAll({});
        });
    }
    getSamples() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.Sample.findAll({});
        });
    }
    getNeurons() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._storageManager.Neuron.findAll({});
        });
    }
}
exports.GraphQLServerContext = GraphQLServerContext;
//# sourceMappingURL=serverContext.js.map