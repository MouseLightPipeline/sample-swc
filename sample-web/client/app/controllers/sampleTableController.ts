/// <reference path="../../../../shared/client/services/sampleService.ts"/>

class SampleTableController {
  public static $inject = [
    "$scope"
  ];

  constructor(private $scope: any) {
    this.$scope.formatStrain = (strain) => {
      return this.formatStrain(strain);
    };
  }

  private formatStrain(strain: IStrain): string {
    if (strain !== null && strain.name.length > 0) {
      return this.$scope.virusService.getDisplayNameForId(strain.virusId) + " : " + strain.name;
    } else {
      return "(none)";
    }
  }
}

angular.module("sampleManager").controller("sampleTableController", SampleTableController);
