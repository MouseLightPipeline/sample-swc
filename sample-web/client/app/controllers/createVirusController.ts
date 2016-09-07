class CreateVirusController extends AbstractCreateItemController<IInjectionVirus> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.injectionVirusService, "#createVirusModal", "virusCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name
    };
  }
}

angular.module("sampleManager").controller("createVirusController", CreateVirusController);

