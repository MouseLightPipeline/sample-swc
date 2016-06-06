'use strict';

module.exports = function(sequelize, DataTypes) {
    var TracingNode = sequelize.define('TracingNode', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        sourceTracingId: DataTypes.UUID, // reference to external node from swc db  
        brainAreaId: DataTypes.UUID,     // reference to external node from sample db  
        comments: DataTypes.TEXT,
        atlasX: DataTypes.DOUBLE,
        atlasY: DataTypes.DOUBLE,
        atlasZ: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate: function(models) {
                TracingNode.belongsTo(models.NodeType, {foreignKey: 'nodeTypeId', as: 'nodeType'});
                TracingNode.belongsTo(models.Tracing, {foreignKey: 'tracingId', as: 'tracing'});
            }
        }
    });
    
    return TracingNode;
};
