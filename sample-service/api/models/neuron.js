"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableName = "Neuron";
function sequelizeImport(sequelize, DataTypes) {
    const Neuron = sequelize.define(exports.TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        idString: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        tag: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        keywords: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        x: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        y: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        z: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
    }, {
        classMethods: {
            associate: function (models) {
                Neuron.belongsTo(models.Injection, { foreignKey: 'injectionId', as: 'injection' });
                Neuron.belongsTo(models.BrainArea, { foreignKey: { name: 'brainAreaId', allowNull: true }, as: 'brainArea' });
            }
        },
        timestamps: true,
        paranoid: true
    });
    return Neuron;
}
exports.sequelizeImport = sequelizeImport;
;
//# sourceMappingURL=neuron.js.map