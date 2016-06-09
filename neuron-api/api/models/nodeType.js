'use strict';

module.exports = function(sequelize, DataTypes) {
    var NodeType = sequelize.define('NodeType', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT,
        mutable: {type: DataTypes.BOOLEAN, defaultValue: false}
    }, {
        classMethods: {
            associate: function(models) {
                NodeType.hasMany(models.TracingNode, {foreignKey: 'tracingNodeId', as: 'nodes'});
            }
        }
    });
    
    NodeType.populateDefault = function() { return populateDefault(NodeType); };
    
    return NodeType;
};


function populateDefault(model) {
    return new Promise((resolve, reject) => {
        model.count().then((count) => {
            if (count < 1) {
                model.create({name: 'Soma', mutable: false});
            }
            if (count < 2) {
                model.create({name: 'Branch', mutable: false});
            }
            if (count < 3) {
                model.create({name: 'End Point', mutable: false});
            }

            resolve();
         }).catch((err) => {
            reject(err);
        });
    });
}
