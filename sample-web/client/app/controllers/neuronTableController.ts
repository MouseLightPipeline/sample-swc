/// <reference path="../../../../shared/client/services/neuronService.ts"/>
/// <reference path="../../../../shared/client/services/sampleService.ts"/>

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

  private formatSample(sampleId: string): string {
    return this.$scope.sampleService.getDisplayNameForId(sampleId);
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
