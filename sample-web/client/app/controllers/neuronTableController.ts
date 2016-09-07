class NeuronTableController {
  public static $inject = [
    "$scope"
  ];

  constructor(private $scope: any) {
    this.$scope.formatSample = (sampleId) => {
      return this.formatSample(sampleId);
    };
    this.$scope.formatBrainArea = (brainAreaId) => {
      return this.formatBrainArea(brainAreaId);
    };
  }

  private formatSample(neuron: INeuron): string {
    let injection: IInjection = this.$scope.injectionService.find(neuron.injectionId);

    if (injection === null) {
      return "(unknown)";
    }

    return this.$scope.sampleService.getDisplayNameForId(injection.sampleId);
  }

  private formatBrainArea(brainAreaId: string): string {
    if (brainAreaId !== null && brainAreaId.length > 0) {
      return this.$scope.brainAreaService.getDisplayNameForId(brainAreaId);
    } else {
      return "(not defined)";
    }
  }
}

angular.module("sampleManager").controller("neuronTableController", NeuronTableController);
