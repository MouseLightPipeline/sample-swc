'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function(sequelize, DataTypes) {
    var BrainArea = sequelize.define('BrainArea', {
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

    function populateDefault(model) {
        return new Promise((resolve, reject) => {
            model.count().then((count) => {
                if (count == 0) {
                    var fixturePath = path.normalize(__dirname + "/../fixtures/mouse-brain-areas.json");

                    fs.readFile(fixturePath, "UTF-8", (err, fileData) => {
                        if (err) {
                            reject(err);
                        } else {
                            var data = JSON.parse(fileData);

                            var objects = [];

                            data.msg.forEach((obj) => {
                                objects.push({
                                    structureId: obj.id,
                                    depth: obj.depth,
                                    parentStructureId: obj.parent_structure_id,
                                    structureIdPath: obj.structure_id_path,
                                    name: obj.name,
                                    safeName: obj.safe_name,
                                    acronym: obj.acronym
                                });
                            });

                            BrainArea.bulkCreate(objects).then(() => {
                                resolve(true);
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                    });
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    BrainArea.populateDefault = function() { return populateDefault(BrainArea); };

    return BrainArea;
};
