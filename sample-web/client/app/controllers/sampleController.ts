/// <reference path="../../../../shared/client/services/sampleService.ts"/>
/// <reference path="../helpers/validation.ts"/>
/// <reference path="../polyfill.ts"/>

class CreateSampleController {
  public static $inject = [
    "$scope"
  ];

  constructor(private $scope: any) {
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

    this.$scope.$watch("model.idNumber", (newValue) => {
      this.$scope.isValidIdNumber = isValidIdNumberValue(newValue);
    });

    this.$scope.$watch("model.sampleDate", (newValue) => {
      this.$scope.isValidDate = isValidDateValue(new Date(newValue));
    });

    this.$scope.$watch("model.virus", (newValue, oldValue) => {
      if (newValue !== oldValue) this.updateStrains(newValue);
    });

    this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

    this.$scope.$watchCollection("injectionService.injectionLocations", () => {
      this.updateInjectionSelection();
    });

    this.$scope.$watch("transformService.transforms", () => {
      this.updateRegistrationSelection();
    });

    this.$scope.$on("injectionCreatedEvent", (evt, injection: string) => {
      this.onInjectionCreatedEvent(evt, injection);
    });

    this.$scope.$on("registrationCreatedEvent", (evt, registration: string) => {
      this.onRegistrationCreatedEvent(evt, registration);
    });

    this.$scope.$on("virusCreatedEvent", (evt, virus: string) => {
      this.onVirusCreatedEvent(evt, virus);
    });

    this.$scope.$on("strainCreatedEvent", (evt, strain: string) => {
      this.onStrainCreatedEvent(evt, strain);
    });

    this.$scope.nameForVirus = (virusId: string) => this.nameForVirus(virusId);

    this.$scope.createSample = () => this.createSample();

    this.$scope.canCreateSample = (): boolean => this.isValidSampleEntry();

    let today = new Date();

    this.$scope.model.sampleDate = today.getFullYear() + "-" + pad(today.getMonth() + 1, 2) + "-" + pad(today.getDate(), 2);
  }

  private isValidSampleEntry(): boolean {
    return this.$scope.isValidDate && this.$scope.isValidIdNumber;
  }

  private onInjectionCreatedEvent(ignore, injection) {
    this.$scope.model.injectionLocation = injection.id;
  }

  private onRegistrationCreatedEvent(ignore, registration) {
    this.$scope.model.registrationTransform = registration.id;
  }

  private onVirusCreatedEvent(ignore, virus) {
    this.$scope.model.virus = virus.id;
  }

  private onStrainCreatedEvent(ignore, strain) {
    if (strain.virusId === this.$scope.model.virus) {
      this.$scope.model.strain = strain.id;
      this.updateStrains(this.$scope.model.virus);
    }
  }

  private onSampleCollectionChanged() {
    let nextValue: number = 1;

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
    if (!virusId || virusId.length === 0) {
      this.$scope.strainsForVirus = [];
      this.$scope.model.strain = "";
    } else {
      let currentStrain = this.$scope.model.strain;

      this.$scope.strainsForVirus = this.$scope.virusService.strainsForVirus(virusId).then((response) => {
        this.$scope.strainsForVirus = response;
        if (response.length > 0) {
          let strain = this.$scope.strainService.find(currentStrain);

          if (strain !== null && strain.virusId === virusId) {
            this.$scope.model.strain = currentStrain;
          } else {
            this.$scope.model.strain = response[0].id;
          }
        } else {
          this.$scope.model.strain = "";
        }
      }).catch((response) => {
        console.log(response);
        this.$scope.strainsForVirus = [];
      });
    }
  }

  private nameForVirus(id: string): string {
    if (!id || id.length === 0)
      return "";

    let virus = this.$scope.virusService.find(id);
    if (virus) {
      return virus.name;
    } else {
      return "";
    }
  }

  private createSample() {
    this.$scope.lastCreateMessage = "";
    this.$scope.lastCreateError = "";

    let sample = {
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
          this.$scope.lastCreateError = "An unknown error occurred connecting to the server.";
      });
    });
  }
}

angular.module("sampleManager").controller("createSampleController", CreateSampleController);
