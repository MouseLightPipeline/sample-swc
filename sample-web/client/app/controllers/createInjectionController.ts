/// <reference path="../../../../shared/client/services/injectionService.ts"/>

class CreateInjectionController extends AbstractCreateItemController<IInjection> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.virusService, "#createInjectionModal", "injectionCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name
    };
  }
}

angular.module("sampleManager").controller("createInjectionController", CreateInjectionController);

