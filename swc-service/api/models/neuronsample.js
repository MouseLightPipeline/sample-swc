'use strict';

module.exports = function(sequelize, DataTypes) {
  var NeuronSample = sequelize.define('NeuronSample', {
    sampleNumber: DataTypes.INTEGER,
    structure: DataTypes.INTEGER,
    x: DataTypes.DOUBLE,
    y: DataTypes.DOUBLE,
    z: DataTypes.DOUBLE,
    radius: DataTypes.DOUBLE,
    parentNumber: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        NeuronSample.belongsTo(models.SwcFile, {foreignKey: 'fileId'});
      }
    }
  });
  return NeuronSample
};
