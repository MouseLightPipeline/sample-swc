/// <reference path="../../../typings/globals/bootstrap/index.d.ts"/>
/// <reference path="../../../../shared/client/services/registrationTransformService.ts"/>

class CreateRegistrationController extends AbstractCreateItemController<IRegistrationTransform> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.transformService, "#createRegistrationModal", "registrationCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name
    };
  }
}

angular.module("sampleManager").controller("createRegistrationController", CreateRegistrationController);
