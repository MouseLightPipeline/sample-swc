'use strict';

module.exports = function(sequelize, DataTypes) {
    var Neuron = sequelize.define('Neuron', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        // reference to external neuron from sample db
        sourceNeuronId: DataTypes.UUID,
        // values copied from raw SWC data
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        tag: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        x: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        y: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        z: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        // unique properties to the transformed/enhanced tracing
        atlasX: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        atlasY: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        atlasZ: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        syncedAt: {
            type: DataTypes.DATE,
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function(models) {
                Neuron.hasMany(models.Tracing, {foreignKey: 'neuronId', as: 'tracings'});
            }
        }
    });

    function updateFromObject(neuron, obj) {
        return neuron.update(obj, {fields: ['idNumber', 'tag', 'x', 'y', 'z']});
    }

    function findOrCreateOneNeuron(obj, resolve, reject) {
        var updateSync = (neuron) => {
            return neuron.update({syncedAt: new Date(obj.updatedAt)});
        }

        Neuron.findOrCreate({where: {sourceNeuronId: obj.id}, defaults: {}}).spread((neuron, created) => {
            if (neuron.syncedAt.getTime() < new Date(obj.updatedAt).getTime()) {
                updateFromObject(neuron, obj)
                    .then(updateSync)
                    .then(resolve)
                    .catch(reject);
            } else {
                resolve(neuron);
            }
        }).catch((error) => {
            reject(error);
        });
    }

    Neuron.migrateSwcNeuron = (obj) => {
        return new Promise((resolve, reject) => {
            findOrCreateOneNeuron(obj, resolve, reject)
        });
    };

    Neuron.migrateSwcNeurons = (data) => {
        var findOrCreate = (obj) => {
            return new Promise((resolve, reject) => {
                findOrCreateOneNeuron(obj, resolve, reject)
            });
        };

        var actions = data.map(findOrCreate);

        return Neuron.sequelize.transaction((t) => {
            return Promise.all(actions);
        });
    };

    return Neuron;
};
