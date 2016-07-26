'use strict';

module.exports = function(sequelize, DataTypes) {
    var Neuron = sequelize.define('Neuron', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        tag: {
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
            associate: function(models) {
                Neuron.belongsTo(models.Injection, {foreignKey: 'injectionId', as: 'injection'});
                Neuron.belongsTo(models.BrainArea, {foreignKey: 'brainAreaId', as: 'brainArea'});
            }
        }
    });
    
    return Neuron;
};
