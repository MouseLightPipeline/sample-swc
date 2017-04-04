"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function loadModels(db, modelLocation) {
    fs.readdirSync(modelLocation).filter(file => {
        return (file.indexOf(".") !== 0) && (file.slice(-3) === ".js");
    }).forEach(file => {
        let modelModule = require(path.join(modelLocation, file));
        const model = db.connection.import(modelModule.TableName, modelModule.sequelizeImport);
        db.models[model.name] = model;
    });
    Object.keys(db.models).forEach(modelName => {
        if (db.models[modelName].associate) {
            db.models[modelName].associate(db.models);
        }
    });
    return db;
}
exports.loadModels = loadModels;
//# sourceMappingURL=modelLoader.js.map