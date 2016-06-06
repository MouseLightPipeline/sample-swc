'use strict';

module.exports = function(sequelize, DataTypes) {
    var Sample = sequelize.define('Sample', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: DataTypes.INTEGER,
        tag: DataTypes.TEXT,
        sampledate: DataTypes.DATE,
        comment: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Sample.belongsTo(models.InjectionLocation, {foreignKey: 'injectionLocationId', as: 'injectionLocation'});
                Sample.belongsTo(models.RegistrationTransform, {foreignKey: 'registrationTransformId', as: 'registrationTransform'});
                Sample.belongsTo(models.Strain, {foreignKey: 'strainId', as: 'strain'});
                Sample.hasMany(models.Neuron, {foreignKey: 'sampleId', as: 'neurons'});
            }
        }
    });
    return Sample;
};
