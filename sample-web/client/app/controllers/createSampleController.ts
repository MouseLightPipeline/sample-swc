/// <reference path="../helpers/validation.ts"/>

class CreateSampleController {
    public static $inject = [
        "$scope",
        "toastr",
        "modalService"
    ];

    constructor(private $scope: any, private toastr: IToastrService, private modalService: ModalService) {
        this.$scope.model = {};
        this.$scope.model.idNumber = "";
        this.$scope.model.sampleDate = "";
        this.$scope.model.tag = "";
        this.$scope.model.comment = "";
        this.$scope.model.mouseStrainId = "";

        this.$scope.isValidIdNumber = false;
        this.$scope.isValidDate = false;

        this.$scope.sampleDatePickerIsOpen = false;

        this.$scope.$watch("model.idNumber", (newValue) => {
            this.$scope.isValidIdNumber = isValidIdNumberValue(newValue);
        });

        this.$scope.$watch("model.sampleDate", (newValue) => {
            this.$scope.isValidDate = isValidDateValue(new Date(newValue));
        });

        this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

        this.$scope.$watchCollection("mouseStrainService.mouseStrains", () => {
            this.updateMouseStrainSelection();
        });

        this.$scope.createMouseStrainCallerContext = () => {
            return () => this.$scope.model.mouseStrainId;
        };

        this.$scope.$on("mouseStrainCreatedEvent", (evt, eventData: ICreateItemEventData<ISelectMouseStrainControllerContext, IMouseStrain>) => {
            this.onMouseStrainCreatedEvent(eventData.callerContext, eventData.item);
        });

        this.$scope.$on("mouseStrainSelectedEvent", (evt, eventData: ICreateItemEventData<ISelectMouseStrainControllerContext, IMouseStrain>) => {
            this.onMouseStrainCreatedEvent(eventData.callerContext, eventData.item);
        });

        this.$scope.openSampleDatePicker = () => {
            this.$scope.sampleDatePickerIsOpen = true;
        };

        this.$scope.createSample = () => this.createSample();

        this.$scope.canCreateSample = (): boolean => this.isValidSampleEntry();

        this.$scope.getSelectedMouseStrainName = () => {
            let strain: IMouseStrain = this.$scope.mouseStrainService.find(this.$scope.model.mouseStrainId);
            return strain ? strain.name : "";
        };

        let today = new Date();

        this.$scope.model.sampleDate = today.getFullYear() + "-" + pad(today.getMonth() + 1, 2) + "-" + pad(today.getDate(), 2);

        this.$scope.foo = () => {
            this.modalService.openSelectMouseStrainController({
                name: this.$scope.getSelectedMouseStrainName(),
                sample: null
            });
        }
    }

    private isValidSampleEntry(): boolean {
        return this.$scope.isValidDate && this.$scope.isValidIdNumber;
    }

    private onMouseStrainCreatedEvent(context: ISelectMouseStrainControllerContext, strain: IMouseStrain) {
        // Anything broadcast with a sample as the context is an edit of an existing.  If it is null, it is applicable
        // here (creating a new).
        if (!context.sample) {
            this.$scope.model.mouseStrainId = strain.id;
        }
    }

    private onSampleCollectionChanged() {
        let nextValue: number = 1;

        while (this.$scope.sampleService.findWithIdNumber(nextValue) !== null) {
            nextValue++;
        }

        this.$scope.model.idNumber = nextValue.toString();
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

        if (!this.$scope.canCreateSample()) {
            this.$scope.lastCreateError = "Can't create";
            return;
        }

        let sample = {
            idNumber: parseInt(this.$scope.model.idNumber),
            sampleDate: new Date(this.$scope.model.sampleDate + "T12:00:00Z").toISOString(),
            tag: this.$scope.model.tag,
            comment: this.$scope.model.comment,
            mouseStrainId: this.$scope.model.mouseStrainId,
            activeRegistrationTransformId: ''
        };

        this.$scope.sampleService.createItem(sample).then((sample) => {
            this.$scope.$apply(() => {
                this.toastr.success("Created sample with id <b>" + sample.idNumber + "</b>", "Success");
            });
        }).catch((error) => {
            this.$scope.$apply(() => {
                let msg = "";
                if (error.data != null)
                    msg = error.data.message;
                else
                    msg = "An unknown error occurred connecting to the server.";
                this.toastr.error(msg, "Error", {timeOut: 0});
            });
        });
    }
}

angular.module("sampleManager").controller("createSampleController", CreateSampleController);
