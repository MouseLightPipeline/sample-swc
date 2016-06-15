/// <reference path="../../../../shared/client/services/virusService.ts"/>

class CreateVirusController extends AbstractCreateItemController<IVirus> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.virusService, "#createVirusModal", "virusCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name
    };
  }
}

angular.module("sampleManager").controller("createVirusController", CreateVirusController);

