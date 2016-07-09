'use strict';

var models = require('./index');

module.exports = function(sequelize, DataTypes) {
    var Virus = sequelize.define('Virus', {
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
                Virus.hasMany(models.Strain, {foreignKey: 'virusId', as: 'strains'});
            }
        }
    });
    
    Virus.populateDefault = function(db) { return populateDefault(db); };
    
    return Virus;
};

function populateDefault(db) {
    return new Promise(function(resolve, reject) {
        db.Virus.count().then(function(count) {
            if (count < 1) {
                db.Virus.create({name: 'SampleVirus', mutable: false}).then(function (virus) {
                    db.Strain.create({name: 'SampleStrain1', mutable: false, virusId: virus.id});
                    db.Strain.create({name: 'SampleStrain2', mutable: false, virusId: virus.id});
                });
            }
            if (count < 2) {
                db.Virus.create({name: 'GFPflox', mutable: false}).then(function (virus) {
                    db.Strain.create({name: 'bl6', mutable: false, virusId: virus.id});
                });
            }
            
            resolve();
         });
    });
}
