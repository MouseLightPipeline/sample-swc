'use strict';

module.exports = function(sequelize, DataTypes) {
    var RegistrationTransform = sequelize.define('RegistrationTransform', {
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
                RegistrationTransform.hasMany(models.Sample, {foreignKey: 'registrationTransformId', as: 'samples'});
            }
        }
    });
    
    RegistrationTransform.populateDefault = function() { return populateDefault(RegistrationTransform); };
    
    return RegistrationTransform;
};

function populateDefault(model) {
    return new Promise(function(resolve, reject) {
        model.count().then(function(count) {
            if (count < 1) {
                model.create({name: 'Affine', mutable: false});
            }
            if (count < 2) {
                model.create({name: 'B-spline', mutable: false});
            }

            resolve();
         });
    });
}
