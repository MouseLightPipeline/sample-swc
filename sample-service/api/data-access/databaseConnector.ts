const path = require("path");
const Sequelize = require("sequelize");

const debug = require("debug")("ndb:sample-service:database-connector");

const env = process.env.NODE_ENV || "development";

const config = require("../../config/database.config");

import {loadModels} from "./modelLoader";

export interface ISampleDatabaseModels {
    BrainArea?: any
    Fluorophore?: any
    InjectionVirus?: any
    MouseStrain?: any
    Sample?: any;
    Injection?: any;
    RegistrationTransform?: any;
    Neuron?: any;
}

export interface ISequelizeDatabase<T> {
    connection: any;
    models: T;
    isConnected: boolean;
}

export class PersistentStorageManager {
    public static Instance(): PersistentStorageManager {
        return _manager;
    }

    public get BrainArea() {
        return this.sampleDatabase.models.BrainArea;
    }

    public get MouseStrain() {
        return this.sampleDatabase.models.MouseStrain;
    }

    public get Fluorophore() {
        return this.sampleDatabase.models.Fluorophore;
    }

    public get InjectionVirus() {
        return this.sampleDatabase.models.InjectionVirus;
    }

    public get Sample() {
        return this.sampleDatabase.models.Sample;
    }
    public get Injection() {
        return this.sampleDatabase.models.Injection;
    }

    public get RegistrationTransform() {
        return this.sampleDatabase.models.RegistrationTransform;
    }

    public get Neuron() {
        return this.sampleDatabase.models.Neuron;
    }

    public async initialize() {
        await authenticate(this.sampleDatabase, "sample");
    }

    private sampleDatabase: ISequelizeDatabase<ISampleDatabaseModels> = createConnection({});
}

async function authenticate(database, name) {
    try {
        await database.connection.authenticate();

        database.isConnected = true;

        debug(`successful database connection: ${name}`);
    } catch (err) {
        debug(`failed database connection: ${name}`);
        debug(err);
        setTimeout(() => authenticate(database, name), 5000);
    }
}

function createConnection<T>(models: T) {
    // Option to override database (e.g., production vs. development) so that one service can run locally with dev hosts
    // but connect to production tables used by production services.
    const databaseConfig = config[env];

    let db: ISequelizeDatabase<T> = {
        connection: null,
        models: models,
        isConnected: false
    };

    debug(`initiating connection: ${databaseConfig.host}:${databaseConfig.port}#${databaseConfig.database}`);

    db.connection = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig);

    return loadModels(db, path.normalize(__dirname + "/../models"));
}

const _manager: PersistentStorageManager = new PersistentStorageManager();

_manager.initialize().then(() => {
});
