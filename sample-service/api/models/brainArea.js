'use strict';

var path = require('path');
var fs = require('fs');
var csv = require('csv')

module.exports = function(sequelize, DataTypes) {
    var BrainArea = sequelize.define('BrainArea', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        abiIdNumber: DataTypes.INTEGER,
        abiName: DataTypes.TEXT
    });
    
    BrainArea.populateDefault = function(db) { return populateDefault(db); };
    
    return BrainArea;
};


function populateDefault(db) {
    return new Promise(function(resolve, reject) {
        db.BrainArea.count().then(function(count) {
            if (count == 0) {
                // Load csv
                var sample = path.normalize(__dirname + '/../fixtures/BrainArea.csv');
                console.log('Trying to load ' + sample)
                fs.readFile(sample, 'UTF-8', function(err, fileData) {
                    csv.parse(fileData, (err, data) => {
                        var objects = [];
                        data.forEach((line) => {
                            var name = line[1].toLowerCase();
                            if (name.includes('layer') || name.includes('part') || name.includes('dorsal') || name.includes('lateral') || name.includes('medial') || name.includes('ventral') || name.includes('anterior') || name.includes('posterior')) {
                            } else {
                                objects.push({abiIdNumber: parseInt(line[0]), abiName: line[1]});
                            }
                        });
                        db.BrainArea.bulkCreate(objects);
                    });
                });
            }
            resolve();
        });
    });
}
