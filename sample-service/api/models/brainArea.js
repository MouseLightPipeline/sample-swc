'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function(sequelize, DataTypes) {
    const BrainArea = sequelize.define('BrainArea', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        structureId: DataTypes.INTEGER,
        depth: DataTypes.INTEGER,
        parentStructureId: DataTypes.INTEGER,
        structureIdPath: DataTypes.TEXT,
        name: DataTypes.TEXT,
        safeName: DataTypes.TEXT,
        acronym: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                BrainArea.hasMany(models.Injection, {foreignKey: 'brainAreaId', as: 'injections'});
                BrainArea.hasMany(models.Neuron, {foreignKey: 'brainAreaId', as: 'neurons'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return BrainArea;
};
