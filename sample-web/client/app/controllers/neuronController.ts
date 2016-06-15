/// <reference path="../../../../shared/client/services/neuronService.ts"/>
/// <reference path="../helpers/validation.ts"/>

class NeuronController {
  public static $inject = [
    "$scope",
    "$http",
    "$resource"
  ];

  constructor(private $scope: any, private $http: any, private $resource: any) {
    this.$scope.model = {};
    this.$scope.model.idNumber = "";
    this.$scope.model.tag = "";
    this.$scope.model.sampleId = "";
    this.$scope.model.brainAreaId = "";

    this.$scope.isValidIdNumber = false;

    this.$scope.lastCreateMessage = "";
    this.$scope.lastCreateError = "";

    this.$scope.$watch("model.idNumber", (newValue) => {
      this.$scope.isValidIdNumber = isValidIdNumberValue(newValue);
    });

    this.$scope.isValidDouble = (val) => isValidDouble(val);

    this.$scope.createNeuron = () => this.createNeuron();

    this.$scope.canCreateNeuron = () : boolean => this.isValidNeuronEntry();

    this.$scope.$watchCollection("neuronService.neurons", (newValues) => this.onNeuronCollectionChanged());

    this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

    this.$scope.model.x = "0";
    this.$scope.model.y = "0";
    this.$scope.model.z = "0";

    this.onSampleCollectionChanged();
  }

  private isValidNeuronEntry(): boolean {
    return this.$scope.isValidIdNumber && this.haveValidSample() && this.haveValidSomaLocation();
  }

  private haveValidSomaLocation() {
    return isValidDouble(this.$scope.model.x) && isValidDouble(this.$scope.model.y) &&  isValidDouble(this.$scope.model.z);
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
    this.$scope.lastCreateMessage = "";
    this.$scope.lastCreateError = "";

    let item = {
      idNumber: parseInt(this.$scope.model.idNumber),
      tag: this.$scope.model.tag,
      sampleId: this.$scope.model.sampleId,
      brainAreaId: this.$scope.model.brainAreaId,
      x: parseFloat(this.$scope.model.x),
      y: parseFloat(this.$scope.model.y),
      z: parseFloat(this.$scope.model.z)
    };

    this.$scope.neuronService.createItem(item).then((neuron) => {
      this.$scope.$apply(() => {
        this.$scope.lastCreateMessage = "Created neuron with id number " + neuron.idNumber;
      });
      setTimeout(() => {
        this.$scope.$apply(() => {
          this.$scope.lastCreateMessage = "";
        });
      }, 4000);
    }).catch((error) => {
      this.$scope.$apply(() => {
        if (error.data != null)
          this.$scope.lastCreateError = error.data.message;
        else
          this.$scope.lastCreateError = "An unknown error occurred connecting to the server.";
      });
    });
  }
}

angular.module("sampleManager").controller("neuronController", NeuronController);
