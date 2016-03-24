'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('SwcFiles', [{
        filename: 'Trh-F-700060.CNG.swc',
        tag: 'First file',
        submitter: 'Me',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      },{
        filename: '11-7-10.CNG.swc',
        tag: 'Second file',
        submitter: 'You and me',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      }], {}).then(function(){
        return queryInterface.bulkInsert('NeuronSamples', [{
          id: 1,
          fileId: 1,
          sampleNumber:  1,
          structure: '2',
          x: '3.1',
          y: '4.2',
          z: '5.3',
          radius: '6.4',
          parentNumber: 0,
          parentId: null,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString()
        },
        {
          id: 2,
          fileId: 1,
          sampleNumber:  2,
          structure: '2',
          x: '7.5',
          y: '8.6',
          z: '9.7',
          radius: '10.8',
          parentNumber: 1,
          parentId: 1,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString()
        }])
       });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
      // return queryInterface.bulkDelete('Person', null, {});
  }
};
