'use strict';

module.exports = function(sequelize, DataTypes) {
    var SwcFile = sequelize.define('SwcFile', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        filename: DataTypes.STRING,
        tag: DataTypes.STRING,
        submitter: DataTypes.STRING,
        comments: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                SwcFile.hasMany(models.NeuronSample, {foreignKey: 'fileId', as: 'samples'});
            }
        }
    });
    return SwcFile;
};
