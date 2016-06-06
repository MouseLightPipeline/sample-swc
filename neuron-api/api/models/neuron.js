'use strict';

module.exports = function(sequelize, DataTypes) {
    var Neuron = sequelize.define('Neuron', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        sourceNeuronId: DataTypes.UUID, // reference to external neuron from sample db
        atlasX: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        atlasY: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        atlasZ: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function(models) {
                Neuron.hasMany(models.Tracing, {foreignKey: 'neuronId', as: 'tracings'});
            }
        }
    });
    return Neuron;
};
