'use strict';

module.exports = function(sequelize, DataTypes) {
    var StructureIdentifier = sequelize.define('StructureIdentifier', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                StructureIdentifier.hasMany(models.TracingNode, {foreignKey: 'structureIdentifierId', as: 'nodes'});
            }
        }
    });
    return StructureIdentifier;
};
