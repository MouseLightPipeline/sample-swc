'use strict';

module.exports = function(sequelize, DataTypes) {
    var Neuron = sequelize.define('Neuron', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        x: DataTypes.DOUBLE,
        y: DataTypes.DOUBLE,
        z: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate: function(models) {
                Neuron.belongsTo(models.Sample, {foreignKey: 'sampleId'});
            }
        }
    });
    return Neuron;
};
