'use strict';

module.exports = function(sequelize, DataTypes) {
    var Fluorophore = sequelize.define('Fluorophore', {
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
        }
    });

    function populateDefault(model) {
        return new Promise((resolve, reject) => {
            model.count().then((count) => {
                if (count < 2) {
                    if (count < 1) {
                        model.create({name: 'eGFP'});
                    }
                    if (count < 2) {
                        model.create({name: 'tdTomato'});
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    Fluorophore.populateDefault = () => {
        return populateDefault(Fluorophore);
    };

    return Fluorophore;
};
