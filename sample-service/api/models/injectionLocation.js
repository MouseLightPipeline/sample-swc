'use strict';

module.exports = function(sequelize, DataTypes) {
    var InjectionLocation = sequelize.define('InjectionLocation', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT,
        mutable: {type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                InjectionLocation.hasMany(models.Sample, {foreignKey: 'injectionLocationId', as: 'samples'});
            }
        }
    });
    
    InjectionLocation.populateDefault = function() { return populateDefault(InjectionLocation); };
    
    return InjectionLocation;
};


function populateDefault(model) {
    return new Promise(function(resolve, reject) {
        model.count().then(function(count) {
            if (count < 1) {
                model.create({name: 'M1', mutable: false});
            }
            if (count < 2) {
                model.create({name: 'Thalamus', mutable: false});
            }

            resolve();
         });
    });
}
