'use strict';

module.exports = function (sequelize, DataTypes) {
    const RegistrationTransform = sequelize.define('RegistrationTransform', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        location: DataTypes.TEXT,
        name: DataTypes.TEXT,
        notes: DataTypes.TEXT,
    }, {
        classMethods: {
            associate: function (models) {
                RegistrationTransform.belongsTo(models.Sample, {foreignKey: 'sampleId', as: 'sample'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return RegistrationTransform;
};
