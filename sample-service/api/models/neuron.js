'use strict';

module.exports = function(sequelize, DataTypes) {
    var Neuron = sequelize.define('Neuron', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: DataTypes.INTEGER,
        tag: DataTypes.TEXT,
        x: DataTypes.DOUBLE,
        y: DataTypes.DOUBLE,
        z: DataTypes.DOUBLE
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
