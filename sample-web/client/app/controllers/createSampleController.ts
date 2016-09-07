/// <reference path="../helpers/validation.ts"/>

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
        this.$scope.model.registrationTransformId = "";
        this.$scope.model.mouseStrainId = "";

        this.$scope.isValidIdNumber = false;
        this.$scope.isValidDate = false;

        this.$scope.lastCreateMessage = "";
        this.$scope.lastCreateError = "";

        this.$scope.sampleDatePickerIsOpen = false;

        this.$scope.$watch("model.idNumber", (newValue) => {
            this.$scope.isValidIdNumber = isValidIdNumberValue(newValue);
        });

        this.$scope.$watch("model.sampleDate", (newValue) => {
            this.$scope.isValidDate = isValidDateValue(new Date(newValue));
         });

        this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

        this.$scope.$watchCollection("transformService.transforms", () => {
            this.updateRegistrationSelection();
        });

        this.$scope.$watchCollection("mouseStrainService.mouseStrains", () => {
            this.updateMouseStrainSelection();
        });

        this.$scope.$on("registrationCreatedEvent", (evt, registration: string) => {
            this.onRegistrationCreatedEvent(evt, registration);
        });

        this.$scope.$on("mouseStrainCreatedEvent", (evt, strain: string) => {
            this.onMouseStrainCreatedEvent(evt, strain);
        });

        this.$scope.openSampleDatePicker = () => {
            this.$scope.sampleDatePickerIsOpen = true;
        }

        this.$scope.createSample = () => this.createSample();

        this.$scope.canCreateSample = (): boolean => this.isValidSampleEntry();

        let today = new Date();

        this.$scope.model.sampleDate = today.getFullYear() + "-" + pad(today.getMonth() + 1, 2) + "-" + pad(today.getDate(), 2);
    }

    private isValidSampleEntry(): boolean {
        return this.$scope.isValidDate && this.$scope.isValidIdNumber;
    }

    private onRegistrationCreatedEvent(ignore, registration) {
        this.$scope.model.registrationTransformId = registration.id;
    }

    private onMouseStrainCreatedEvent(ignore, strain) {
        this.$scope.model.mouseStrainId = strain.id;
    }

    private onSampleCollectionChanged() {
        let nextValue: number = 1;

        while (this.$scope.sampleService.findWithIdNumber(nextValue) !== null) {
            nextValue++;
        }

        this.$scope.model.idNumber = nextValue.toString();
    }

    private updateRegistrationSelection() {
        if (this.$scope.transformService.find(this.$scope.model.registrationTransformId) === null) {
            this.$scope.model.registrationTransformId = "";
        }

        if (this.$scope.model.registrationTransformId === "" && this.$scope.transformService.transforms.length > 0) {
            this.$scope.model.registrationTransformId = this.$scope.transformService.transforms[0].id;
        }
    }

    private updateMouseStrainSelection() {
        if (this.$scope.mouseStrainService.find(this.$scope.model.mouseStrainId) === null) {
            this.$scope.model.mouseStrainId = "";
        }

        if (this.$scope.model.mouseStrainId === "" && this.$scope.mouseStrainService.mouseStrains.length > 0) {
            this.$scope.model.mouseStrainId = this.$scope.mouseStrainService.mouseStrains[0].id;
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
            registrationTransformId: this.$scope.model.registrationTransformId,
            mouseStrainId: this.$scope.model.mouseStrainId
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
