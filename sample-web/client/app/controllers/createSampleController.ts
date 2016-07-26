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
        this.$scope.model.registrationTransform = "";
        this.$scope.model.strain = "";

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

        this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

        this.$scope.$watch("transformService.transforms", () => {
            this.updateRegistrationSelection();
        });

        this.$scope.$watch("mouseStrainService.mouseStrains", () => {
            this.updateMouseStrainSelection();
        });

        this.$scope.$on("registrationCreatedEvent", (evt, registration: string) => {
            this.onRegistrationCreatedEvent(evt, registration);
        });

        this.$scope.$on("mouseStrainCreatedEvent", (evt, strain: string) => {
            this.onMouseStrainCreatedEvent(evt, strain);
        });

        this.$scope.createSample = () => this.createSample();

        this.$scope.canCreateSample = (): boolean => this.isValidSampleEntry();

        let today = new Date();

        this.$scope.model.sampleDate = today.getFullYear() + "-" + pad(today.getMonth() + 1, 2) + "-" + pad(today.getDate(), 2);
    }

    private isValidSampleEntry(): boolean {
        return this.$scope.isValidDate && this.$scope.isValidIdNumber;
    }

    private onRegistrationCreatedEvent(ignore, registration) {
        this.$scope.model.registrationTransform = registration.id;
    }

    private onMouseStrainCreatedEvent(ignore, strain) {
        this.$scope.model.strain = strain.id;
    }

    private onSampleCollectionChanged() {
        let nextValue: number = 1;

        while (this.$scope.sampleService.findWithIdNumber(nextValue) !== null) {
            nextValue++;
        }

        this.$scope.model.idNumber = nextValue.toString();
    }

    private updateRegistrationSelection() {
        if (this.$scope.transformService.findIndex(this.$scope.model.registrationTransform) < 0) {
            this.$scope.model.registrationTransform = "";
        }
    }

    private updateMouseStrainSelection() {
        if (this.$scope.mouseStrainService.findIndex(this.$scope.model.strain) < 0) {
            this.$scope.model.strain = "";
        }
    }

    private createSample() {
        this.$scope.lastCreateMessage = "";
        this.$scope.lastCreateError = "";

        let sample = {
            idNumber: parseInt(this.$scope.model.idNumber),
            sampleDate: new Date(this.$scope.model.sampleDate + "T12:00:00Z").toISOString(),
            tag: this.$scope.model.tag,
            comment: this.$scope.model.comment,
            registrationTransformId: this.$scope.model.registrationTransform === "" ? "" : this.$scope.model.registrationTransform,
            mouseStrainId: this.$scope.model.strain === "" ? "" : this.$scope.model.strain
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
