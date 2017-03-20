'use strict';

module.exports = function(sequelize, DataTypes) {
    const StructureIdentifier = sequelize.define('StructureIdentifier', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT,
        value: DataTypes.INTEGER,
        mutable: {type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                StructureIdentifier.hasMany(models.SwcTracingNode, {foreignKey: 'structureIdentifierId', as: 'nodes'});
            }
        },
        timestamps: true,
        paranoid: true
    });
    
    return StructureIdentifier;
};
