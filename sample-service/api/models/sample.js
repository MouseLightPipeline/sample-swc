'use strict';

module.exports = function(sequelize, DataTypes) {
    var Sample = sequelize.define('Sample', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        tag: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        comment: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        sampleDate: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                Sample.belongsTo(models.RegistrationTransform, {foreignKey: 'registrationTransformId', as: 'registrationTransform'});
                Sample.belongsTo(models.MouseStrain, {foreignKey: 'mouseStrainId', as: 'mouseStrain'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return Sample;
};
