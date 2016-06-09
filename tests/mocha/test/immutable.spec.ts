/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/immutable/index.d.ts" />
/// <reference path="./chai-immutable.d.ts" />

import chai = require('chai');

//import chaiImmutable = require('chai-immutable');

//chai.use(chaiImmutable);

var expect = chai.expect;

import immutable = require('immutable');

var List = immutable.List;

describe('immutability', () => {

  describe('A List', () => {

    function addMovie(currentState, movie) {
      return currentState.push(movie);
    }

    it('is immutable', () => {
      let state = List.of('Trainspotting', '28 Days Later');
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(List.of(
        'Trainspotting',
        '28 Days Later',
        'Sunshine'
      ));
      expect(state).to.equal(List.of(
        'Trainspotting',
        '28 Days Later'
      ));
    });

  });

});
