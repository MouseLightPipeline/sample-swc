'use strict';

module.exports = function(sequelize, DataTypes) {
    const TracingNode = sequelize.define('SwcTracingNode', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        sampleNumber: DataTypes.INTEGER,
        parentNumber: DataTypes.INTEGER,
        x: DataTypes.DOUBLE,
        y: DataTypes.DOUBLE,
        z: DataTypes.DOUBLE,
        radius: DataTypes.DOUBLE,
    }, {
        classMethods: {
            associate: function(models) {
                TracingNode.belongsTo(models.StructureIdentifier, {foreignKey: 'structureIdentifierId'});
                TracingNode.belongsTo(models.SwcTracing, {foreignKey: 'swcTracingId'});
            }
        },
        timestamps: true,
        paranoid: false
    });
    
    return TracingNode;
};
