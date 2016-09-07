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
