'use strict';

module.exports = function(sequelize, DataTypes) {
    var MarkerLocation = sequelize.define('MarkerLocation', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        x: DataTypes.DOUBLE,
        y: DataTypes.DOUBLE,
        z: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate: function(models) {
                MarkerLocation.belongsTo(models.Tracing, {foreignKey: 'tracingId', as: 'tracing'});
            }
        }
    });
    
    return MarkerLocation;
};
