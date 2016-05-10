'use strict';

module.exports = function(sequelize, DataTypes) {
    var Tracing = sequelize.define('Tracing', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        filename: DataTypes.STRING,
        tag: DataTypes.STRING,
        annotator: DataTypes.STRING,
        comments: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Tracing.belongsTo(models.Neuron, {foreignKey: 'neuronId'});
                Tracing.hasMany(models.TracingNode, {foreignKey: 'tracingId', as: 'nodes'});
            }
        }
    });
    return Tracing;
};
