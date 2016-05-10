'use strict';

module.exports = function(sequelize, DataTypes) {
    var Virus = sequelize.define('Virus', {
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
                Virus.hasMany(models.Strain, {foreignKey: 'virtusId', as: 'strains'});
            }
        }
    });
    
    return Virus;
};
