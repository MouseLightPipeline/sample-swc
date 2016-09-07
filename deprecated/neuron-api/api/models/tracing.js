'use strict';

var sampleApi = require('../helpers/sampleApi');

module.exports = function(sequelize, DataTypes) {
    var Tracing = sequelize.define('Tracing', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        // reference to external tracing from swc db
        sourceTracingId: DataTypes.UUID,
        // values copied from raw SWC data
        filename: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        annotator: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        // comment lines found in SWC file
        comments: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        // Janelia offset defined in file comments
        offsetX: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        offsetY: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        offsetZ: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        // unique properties to the transformed/enhanced tracing
        lengthMicrometers: {
            type: DataTypes.DOUBLE,
            defaultValue: -1
        },
        syncedAt: {
            type: DataTypes.DATE,
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function(models) {
                Tracing.belongsTo(models.Neuron, {foreignKey: 'neuronId', as: 'neuron'});
                Tracing.hasMany(models.MarkerLocation, {foreignKey: 'tracingId', as: 'markers'});
                Tracing.hasMany(models.TracingNode, {foreignKey: 'tracingId', as: 'nodes'});
            }
        }
    });

    function findOrCreateOneTracing(models, obj, resolve, reject) {
        var updateFromSwcObj = (tracing) => {
            return tracing.update(obj, {fields: ['filename', 'annotator', 'comments', 'offsetX', 'offsetY', 'offsetZ']})
        };

        var findOrCreateTracing = (neuron) => {
            return Tracing.findOrCreate({where: {sourceTracingId: obj.id}, defaults: {neuronId: neuron.id}}).spread((tracing, created) => {
                return tracing.update({neuronId: neuron.id}).then(updateFromSwcObj);
            });
        }

        sampleApi.requestNeuron(obj.neuronId)
            .then(models.Neuron.migrateSwcNeuron)
            .then(findOrCreateTracing)
            .then(resolve)
            .catch(reject);
    }

    Tracing.migrateSwcTracing = (models, obj) => {
        return new Promise((resolve, reject) => {
            findOrCreateOneTracing(models, obj, resolve, reject)
        });
    };

    Tracing.migrateSwcTracings = (models, data) => {
        var findOrCreate = (obj) => {
            return new Promise((resolve, reject) => {
                findOrCreateOneTracing(models, obj, resolve, reject)
            });
        };

        return Tracing.sequelize.transaction(() => {
            return Promise.all(data.map(findOrCreate));
        });
    };

    return Tracing;
};
