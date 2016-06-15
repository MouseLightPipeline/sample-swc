/// <reference path="../../../../shared/client/services/strainService.ts"/>

class CreateStrainController extends AbstractCreateItemController<IStrain> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.strainService, "#createStrainModal", "strainCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name,
      // This works because it is a child controller to the createSampleController
      virusId: this.$scope.model.virus
    };
  }
}

angular.module("sampleManager").controller("createStrainController", CreateStrainController);

