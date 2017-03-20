'use strict';

module.exports = function(sequelize, DataTypes) {
    const Sample = sequelize.define('Sample', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        animalId: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        tag: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        comment: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        sampleDate: DataTypes.DATE,
        activeRegistrationTransformId: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },

    }, {
        classMethods: {
            associate: function(models) {
                Sample.hasMany(models.RegistrationTransform, {foreignKey: 'sampleId', as: 'registrationTransforms'});
                Sample.belongsTo(models.MouseStrain, {foreignKey: 'mouseStrainId', as: 'mouseStrain'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return Sample;
};
