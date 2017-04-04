"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableName = "MouseStrain";
function sequelizeImport(sequelize, DataTypes) {
    const MouseStrain = sequelize.define(exports.TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        timestamps: true,
        paranoid: true
    });
    return MouseStrain;
}
exports.sequelizeImport = sequelizeImport;
;
//# sourceMappingURL=mousestrain.js.map