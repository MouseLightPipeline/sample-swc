"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableName = "InjectionVirus";
function sequelizeImport(sequelize, DataTypes) {
    const InjectionVirus = sequelize.define(exports.TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        classMethods: {
            associate: (models) => {
                InjectionVirus.hasMany(models.Injection, {
                    foreignKey: 'injectionVirusId',
                    as: 'injections'
                });
            }
        },
        timestamps: true,
        paranoid: true,
        tableName: 'InjectionViruses'
    });
    return InjectionVirus;
}
exports.sequelizeImport = sequelizeImport;
;
//# sourceMappingURL=injectionVirus.js.map