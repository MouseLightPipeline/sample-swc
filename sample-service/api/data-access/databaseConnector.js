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
const path = require("path");
const Sequelize = require("sequelize");
const debug = require("debug")("ndb:sample-service:database-connector");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/database.config");
const modelLoader_1 = require("./modelLoader");
class PersistentStorageManager {
    constructor() {
        this.sampleDatabase = createConnection({});
    }
    static Instance() {
        return _manager;
    }
    get BrainArea() {
        return this.sampleDatabase.models.BrainArea;
    }
    get MouseStrain() {
        return this.sampleDatabase.models.MouseStrain;
    }
    get Fluorophore() {
        return this.sampleDatabase.models.Fluorophore;
    }
    get InjectionVirus() {
        return this.sampleDatabase.models.InjectionVirus;
    }
    get Sample() {
        return this.sampleDatabase.models.Sample;
    }
    get Injection() {
        return this.sampleDatabase.models.Injection;
    }
    get RegistrationTransform() {
        return this.sampleDatabase.models.RegistrationTransform;
    }
    get Neuron() {
        return this.sampleDatabase.models.Neuron;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield authenticate(this.sampleDatabase, "sample");
        });
    }
}
exports.PersistentStorageManager = PersistentStorageManager;
function authenticate(database, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database.connection.authenticate();
            database.isConnected = true;
            debug(`successful database connection: ${name}`);
        }
        catch (err) {
            debug(`failed database connection: ${name}`);
            debug(err);
            setTimeout(() => authenticate(database, name), 5000);
        }
    });
}
function createConnection(models) {
    // Option to override database (e.g., production vs. development) so that one service can run locally with dev hosts
    // but connect to production tables used by production services.
    const databaseConfig = config[env];
    let db = {
        connection: null,
        models: models,
        isConnected: false
    };
    debug(`initiating connection: ${databaseConfig.host}:${databaseConfig.port}#${databaseConfig.database}`);
    db.connection = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig);
    return modelLoader_1.loadModels(db, path.normalize(__dirname + "/../models"));
}
const _manager = new PersistentStorageManager();
_manager.initialize().then(() => {
});
//# sourceMappingURL=databaseConnector.js.map