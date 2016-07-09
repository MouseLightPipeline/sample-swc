'use strict';

module.exports = function(sequelize, DataTypes) {
    var Strain = sequelize.define('Strain', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT,
        mutable: {type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                Strain.belongsTo(models.Virus, {foreignKey: 'virusId'});
            }
        }
    });
    
    return Strain;
};
