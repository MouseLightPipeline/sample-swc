/// <reference path="../../../../shared/client/services/neuronService.ts"/>

module SampleManager {
  'use strict';

  export class NeuronController {
    public static $inject = [
      '$scope',
      '$http',
      '$resource'
    ];

    constructor(private $scope: any, private $http: any, private $resource: any) {
      this.$scope.model = {};
      this.$scope.model.idNumber = '';
      this.$scope.model.tag = '';
      this.$scope.model.sampleId = '';
      this.$scope.model.brainAreaId = '';

      this.$scope.isValidIdNumber = false;

      this.$scope.$watch('model.idNumber', (newValue) => {
        this.$scope.isValidIdNumber = this.isValidIdNumberValue(newValue);
      });

      this.$scope.isValidDouble = (val) => this.isValidDouble(val);

      this.$scope.createNeuron = () => this.createNeuron();

      this.$scope.canCreateNeuron = () : boolean => this.isValidNeuronEntry();

      this.$scope.$watchCollection('neuronService.neurons', (newValues) => this.onNeuronCollectionChanged());

      this.$scope.$watchCollection('sampleService.samples', (newValues) => this.onSampleCollectionChanged());

      this.$scope.model.x = '0';
      this.$scope.model.y = '0';
      this.$scope.model.z = '0';

      this.onSampleCollectionChanged();
    }

    private isValidNeuronEntry(): boolean {
      return this.$scope.isValidIdNumber && this.haveValidSample() && this.haveValidSomaLocation();
    }

    private isValidIdNumberValue(val: string) : boolean {
      return (val.length > 0) && !isNaN(Number(val)) && Number.isInteger(Number(val));
    }

    private isValidDouble(val: string) {
      return (val.length > 0) && !isNaN(Number(val));
    }

    private haveValidSomaLocation() {
      return this.isValidDouble(this.$scope.model.x) && this.isValidDouble(this.$scope.model.y) &&  this.isValidDouble(this.$scope.model.z);
    }

    private haveValidSample() : boolean {
      return this.$scope.model.sampleId.length > 0;
    }

    private onNeuronCollectionChanged() {
      var nextValue: number = 1;

      while (this.$scope.neuronService.findWithIdNumber(nextValue) !== null) {
        nextValue++;
      }

      this.$scope.model.idNumber = nextValue.toString();
    }

    private onSampleCollectionChanged() {
      if ((this.$scope.model.sampleId.length == 0) && (this.$scope.sampleService.samples.length > 0)) {
        this.$scope.model.sampleId = this.$scope.sampleService.samples.slice(-1).pop().id;
      }
    }

    private createNeuron() {
      var neuron = {
        idNumber: parseInt(this.$scope.model.idNumber),
        tag: this.$scope.model.tag,
        sampleId: this.$scope.model.sampleId,
        brainAreaId: this.$scope.model.brainAreaId,
        x: parseFloat(this.$scope.model.x),
        y: parseFloat(this.$scope.model.y),
        z: parseFloat(this.$scope.model.z)
      };

      this.$scope.neuronService.createItem(neuron);
    }
  }

  angular.module('sampleManager').controller('neuronController', NeuronController);
}
