'use strict';

module.exports = function(sequelize, DataTypes) {
    const Fluorophore = sequelize.define('Fluorophore', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Fluorophore.hasMany(models.Injection, {foreignKey: 'fluorophoreId', as: 'injections'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return Fluorophore;
};
