'use strict';

module.exports = function (sequelize, DataTypes) {
    var RegistrationTransform = sequelize.define('RegistrationTransform', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                RegistrationTransform.hasMany(models.Sample, {foreignKey: 'registrationTransformId', as: 'samples'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    function populateDefault(model) {
        return new Promise((resolve, reject) => {
            model.count().then((count) => {
                if (count < 2) {
                    if (count < 1) {
                        model.create({name: 'Affine'});
                    }
                    if (count < 2) {
                        model.create({name: 'B-spline'});
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    RegistrationTransform.populateDefault = () => {
        return populateDefault(RegistrationTransform);
    };

    return RegistrationTransform;
};
