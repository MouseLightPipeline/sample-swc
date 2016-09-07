class CreateMouseStrainController extends AbstractCreateItemController<IMouseStrain> {
  public static $inject = [
    "$scope"
  ];

  constructor(protected $scope: any) {
    super($scope, $scope.mouseStrainService, "#createMouseStrainModal", "mouseStrainCreatedEvent");
  }

  protected createObject(): any {
    return {
      name: this.$scope.item.name,
    };
  }
}

angular.module("sampleManager").controller("createMouseStrainController", CreateMouseStrainController);

