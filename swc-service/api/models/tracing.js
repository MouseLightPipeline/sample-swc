'use strict';

module.exports = function(sequelize, DataTypes) {
    var Tracing = sequelize.define('Tracing', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        filename: DataTypes.STRING,
        annotator: DataTypes.STRING,
        lengthMicrometers: DataTypes.DOUBLE,
        neuronId:  DataTypes.UUID // reference to external database entry
    }, {
        classMethods: {
            associate: function(models) {
                Tracing.hasMany(models.MarkerLocation, {foreignKey: 'tracingId', as: 'markers'});
                Tracing.hasMany(models.TracingNode, {foreignKey: 'tracingId', as: 'nodes'});
            }
        }
    });
    
    return Tracing;
};
