"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableName = "Injection";
function sequelizeImport(sequelize, DataTypes) {
    const Injection = sequelize.define(exports.TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
    }, {
        classMethods: {
            associate: function (models) {
                Injection.belongsTo(models.BrainArea, { foreignKey: 'brainAreaId', as: 'location' });
                Injection.belongsTo(models.InjectionVirus, { foreignKey: 'injectionVirusId', as: 'injectionVirus' });
                Injection.belongsTo(models.Fluorophore, { foreignKey: 'fluorophoreId', as: 'fluorophore' });
                Injection.belongsTo(models.Sample, { foreignKey: 'sampleId', as: 'sample' });
                Injection.hasMany(models.Neuron, { foreignKey: 'injectionId', as: 'neurons' });
            }
        },
        timestamps: true,
        paranoid: true
    });
    return Injection;
}
exports.sequelizeImport = sequelizeImport;
;
//# sourceMappingURL=injection.js.map