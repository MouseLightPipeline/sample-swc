'use strict';

module.exports = function(sequelize, DataTypes) {
    const MouseStrain = sequelize.define('MouseStrain', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        timestamps: true,
        paranoid: true
    });

    return MouseStrain;
};
