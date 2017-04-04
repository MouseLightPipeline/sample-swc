"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableName = "Fluorophore";
function sequelizeImport(sequelize, DataTypes) {
    const Fluorophore = sequelize.define(exports.TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                Fluorophore.hasMany(models.Injection, { foreignKey: 'fluorophoreId', as: 'injections' });
            }
        },
        timestamps: true,
        paranoid: true
    });
    return Fluorophore;
}
exports.sequelizeImport = sequelizeImport;
;
//# sourceMappingURL=fluorophore.js.map