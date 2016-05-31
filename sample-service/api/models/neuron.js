'use strict';

module.exports = function(sequelize, DataTypes) {
    var Neuron = sequelize.define('Neuron', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: DataTypes.INTEGER,
        x: DataTypes.DOUBLE,
        y: DataTypes.DOUBLE,
        z: DataTypes.DOUBLE,
        atlasX: DataTypes.DOUBLE,
        atlasY: DataTypes.DOUBLE,
        atlasZ: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate: function(models) {
                Neuron.belongsTo(models.Sample, {foreignKey: 'sampleId', as: 'sample'});
                Neuron.belongsTo(models.BrainArea, {foreignKey: 'brainAreaId', as: 'brainArea'});
            }
        }
    });
    return Neuron;
};
