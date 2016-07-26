'use strict';

module.exports = function(sequelize, DataTypes) {
    var MouseStrain = sequelize.define('MouseStrain', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    });

    function populateDefault(model) {
        return new Promise((resolve, reject) => {
            model.count().then((count) => {
                if (count < 2) {
                    if (count < 1) {
                        model.create({name: 'C57BL/6J’'});
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

    MouseStrain.populateDefault = () => {
        return populateDefault(MouseStrain);
    };

    return MouseStrain;
};
