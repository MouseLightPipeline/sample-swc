'use strict';

module.exports = function(sequelize, DataTypes) {
    var InjectionLocation = sequelize.define('InjectionLocation', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                InjectionLocation.hasMany(models.Sample, {foreignKey: 'injectionLocationId', as: 'samples'});
            }
        }
    });
    return InjectionLocation;
};
