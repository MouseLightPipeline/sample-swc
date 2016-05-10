'use strict';

module.exports = function(sequelize, DataTypes) {
    var Sample = sequelize.define('Sample', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        date: DataTypes.DATE,
        virus: DataTypes.TEXT,
        strain: DataTypes.TEXT,
        comment: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Sample.belongsTo(models.InjectionLocation, {foreignKey: 'injectionLocationId', as: 'injectionLocation'});
                Sample.belongsTo(models.RegistrationTransform, {foreignKey: 'registrationTransformId', as: 'registrationTransform'});
                Sample.hasMany(models.Neuron, {foreignKey: 'sampleId', as: 'neurons'});
            }
        }
    });
    return Sample;
};
