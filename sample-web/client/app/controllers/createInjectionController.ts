/// <reference path="../../../../shared/client/services/injectionService.ts"/>

class CreateInjectionController {
  public static $inject = [
    "$scope"
  ];

  constructor(private $scope: any) {
    this.$scope.newInjection = {};
    this.$scope.newInjection.name = "unnamed";
    this.$scope.errorMessage = "";

    this.$scope.createInjectionLocation = () => this.createInjectionLocation();

    $("#createInjectionModal").on("show.bs.modal", (e) => { this.resetDialog(e); });
  }

  private createInjectionLocation() {
    var injectionLocation = {
      name: this.$scope.newInjection.name
    };

    this.$scope.injectionService.createItem(injectionLocation).then((injection) => {
      this.$scope.$apply(() => {
        this.$scope.$emit("injectionCreatedEvent", injection.id);
        var element = $("#createInjectionModal") as any;
        element.modal("hide");
      });
    }).catch((response) => {
      this.$scope.$apply(() => {
        if (response && response.data && response.data.message) {
          this.$scope.errorMessage = response.data.message;
        } else {
          this.$scope.errorMessage = "An unknown error occurred creating the injection location.";
        }
      });
    });
  }

  private resetDialog(e) {
    this.$scope.$apply(() => {
      this.$scope.errorMessage = "";
    });
  }
}

angular.module("sampleManager").controller("createInjectionController", CreateInjectionController);

