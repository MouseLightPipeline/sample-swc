/// <reference path="../../../typings/globals/bootstrap/index.d.ts"/>
/// <reference path="../../../../shared/client/services/transformService.ts"/>

class CreateRegistrationController extends AbstractCreateItemController<IInjection> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.virusService, "#createRegistrationModal", "registrationCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name
    };
  }
}

angular.module("sampleManager").controller("createRegistrationController", CreateRegistrationController);
