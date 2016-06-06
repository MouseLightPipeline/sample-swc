'use strict';

module.exports = function(sequelize, DataTypes) {
    var Tracing = sequelize.define('Tracing', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        sourceTracingId: DataTypes.UUID, // reference to external tracing from swc db  
        lengthMicrometers: DataTypes.DOUBLE      
    }, {
        classMethods: {
            associate: function(models) {
                Tracing.belongsTo(models.Neuron, {foreignKey: 'neuronId', as: 'neuron'});
                Tracing.hasMany(models.MarkerLocation, {foreignKey: 'tracingId', as: 'markers'});
                Tracing.hasMany(models.TracingNode, {foreignKey: 'tracingId', as: 'nodes'});
            }
        }
    });
    
    return Tracing;
};
