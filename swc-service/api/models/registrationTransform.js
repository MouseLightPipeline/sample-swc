'use strict';

module.exports = function(sequelize, DataTypes) {
    var RegistrationTransform = sequelize.define('RegistrationTransform', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                RegistrationTransform.hasMany(models.Sample, {foreignKey: 'registrationTransformId', as: 'samples'});
            }
        }
    });
    return RegistrationTransform;
};
