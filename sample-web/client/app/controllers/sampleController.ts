/// <reference path="../../../../shared/client/services/sampleService.ts"/>
/// <reference path="../polyfill.ts"/>

class SampleController {
    public static $inject = [
      "$scope",
      "$http",
      "$resource"
    ];

    constructor(private $scope: any, private $http: any, private $resource: any) {
      var today = new Date();

      this.$scope.model = {};
      this.$scope.model.idNumber = "";
      this.$scope.model.sampleDate = "";
      this.$scope.model.tag = "";
      this.$scope.model.comment = "";
      this.$scope.model.injectionLocation = "";
      this.$scope.model.registrationTransform = "";
      this.$scope.model.virus = "";
      this.$scope.model.strain = "";

      this.$scope.strainsForVirus = [];

      this.$scope.isValidIdNumber = false;
      this.$scope.isValidDate = false;

      this.$scope.lastCreateMessage = "";
      this.$scope.lastCreateError = "";

      this.$scope.$watch("model.idNumber", (newValue, oldValue) => {
        this.$scope.isValidIdNumber = this.isValidIdNumberValue(newValue);
      });

      this.$scope.$watch("model.sampleDate", (newValue, oldValue) => {
        this.$scope.isValidDate = this.isValidDateValue(new Date(newValue));
      });

      this.$scope.$watch("model.virus", (newValue, oldValue) => {
        if (newValue !== oldValue) this.updateStrains(newValue);
      });

      this.$scope.$watchCollection("injectionService.injectionLocations", (newValues) => {
        this.updateInjectionSelection();
      });

      this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

      this.$scope.$watch("transformService.transforms", (newValue, oldValue) => {
        this.updateRegistrationSelection();
      });

      this.$scope.$on("injectionCreatedEvent", (evt, injectionId: string) => {
        this.onInjectionCreatedEvent(evt, injectionId);
      })

      this.$scope.nameForVirus = (virusId: string) => this.nameForVirus(virusId);

      this.$scope.createSample = () => this.createSample();

      this.$scope.canCreateSample = (): boolean => this.isValidSampleEntry();

      this.$scope.model.sampleDate = today.getFullYear() + "-" + this.pad(today.getMonth() + 1, 2) + "-" + this.pad(today.getDate(), 2);
    }

    pad(n, width, z = "0"): string {
      n = n + "";
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    private isValidIdNumberValue(val: string): boolean {
      return (val.length > 0) && !isNaN(Number(val)) && Number.isInteger(Number(val));
    }

    private isValidDateValue(val: any): boolean {
      return !isNaN(val) && val.getFullYear() > 1900;
    }

    private isValidSampleEntry(): boolean {
      return this.$scope.isValidDate && this.$scope.isValidIdNumber;
    }

    private onInjectionCreatedEvent(evt, injectionId) {
      this.$scope.model.injectionLocation = injectionId;
    }

    private onSampleCollectionChanged() {
      var nextValue: number = 1;

      while (this.$scope.sampleService.findWithIdNumber(nextValue) !== null) {
        nextValue++;
      }

      this.$scope.model.idNumber = nextValue.toString();
    }

    private updateInjectionSelection() {
      // If the selected injection location no longer exists, don"t let it be selected or the model value.
      if (this.$scope.injectionService.findIndex(this.$scope.model.injectionLocation) < 0) {
        this.$scope.model.injectionLocations = "";
      }
    }

    private updateRegistrationSelection() {
      if (this.$scope.transformService.findIndex(this.$scope.model.registrationTransform) < 0) {
        this.$scope.model.registrationTransform = "";
      }
    }

    private updateStrains(virusId) {
      if (!virusId || virusId.length == 0) {
        this.$scope.strainsForVirus = [];
      } else {
        this.$scope.strainsForVirus = this.$scope.virusService.strainsForVirus(virusId).then((response) => {
          this.$scope.strainsForVirus = response;
          if (response.length > 0) {
            this.$scope.model.strain = response[0].id;
          }
        }).catch((response) => {
          this.$scope.strainsForVirus = [];
        });
      }
    }

    private nameForVirus(id: string): string {
      if (!id || id.length === 0)
        return "";

      var virus = this.$scope.virusService.find(id);
      if (virus) {
        return virus.name;
      } else {
        return "";
      }
    }

    private createSample() {
      this.$scope.lastCreateMessage = "";
      this.$scope.lastCreateError = "";

      var sample = {
        idNumber: parseInt(this.$scope.model.idNumber),
        sampleDate: new Date(this.$scope.model.sampleDate + "T12:00:00Z").toISOString(),
        injectionLocationId: this.$scope.model.injectionLocation === "" ? "" : this.$scope.model.injectionLocation,
        registrationTransformId: this.$scope.model.registrationTransform === "" ? "" : this.$scope.model.registrationTransform,
        strainId: this.$scope.model.strain === "" ? "" : this.$scope.model.strain,
        tag: this.$scope.model.tag,
        comment: this.$scope.model.comment
      };

      this.$scope.sampleService.createItem(sample).then((sample) => {
        this.$scope.$apply(() => {
          this.$scope.lastCreateMessage = "Created sample with id number " + sample.idNumber;
        });
        setTimeout(() => {
          this.$scope.$apply(() => {
            this.$scope.lastCreateMessage = "";
          });
        }, 4000);
      }).catch((error) => {
        this.$scope.$apply(() => {
          if (error.data != null)
            this.$scope.lastCreateError = error.data.message;
          else
            this.$scope.lastCreateError = "An unknown error occured connecting to the server.";
        });
      });
    }
  }

  angular.module("sampleManager").controller("sampleController", SampleController);
