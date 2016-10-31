class SampleTableController {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    constructor(private $scope: any, private modalService: ModalService) {

        this.$scope.injectionsForSample = {};

        this.$scope.formatRegistrationTransforms = (sample: ISample) => this.formatRegistrationTransforms(sample);

        this.$scope.formatMouseStrain = (sample: ISample) => this.formatMouseStrain(sample);

        this.$scope.formatInjections = (sample: ISample) => this.formatInjections(sample);

        this.$scope.$watchCollection("sampleService.samples", () => this.onSampleCollectionChanged());

        this.$scope.createMouseStrainCallerContext = (sample: ISample) => {
            return {controller: this, sample: sample};
        }

        this.$scope.$on("injectionAdded", (evt, sample, injection) => {
            this.$scope.$apply(() => {
                // sample.injections.push(injection.id);
            })
        });

        this.$scope.$on("registrationCreatedEvent", (evt, eventData: ICreateItemEventData<ISample, IMouseStrain>) => {
            this.$scope.refresh();
        });

        this.$scope.$on("registrationSelectedEvent", (evt, eventData: ICreateItemEventData<ISample, IMouseStrain>) => {
            this.$scope.refresh();
        });

        this.$scope.inspectSample = (sample: ISample) => {
            this.modalService.openInspectSampleController(sample);
        }

        this.$scope.selectMouseStrain = (sample: ISample) => {
            this.modalService.openSelectMouseStrainController({
                name: this.nameForMouseStrain(sample),
                sample: sample
            });
        };

        this.$scope.selectRegistrationTransform = (sample: ISample) => {
            this.modalService.openRegistrationTransformController(sample);
        };
    }

    private onSampleCollectionChanged() {
    }

    private nameForMouseStrain(sample: ISample) {
        let mouseStrain: IMouseStrain = this.$scope.mouseStrainService.find(sample.mouseStrainId);

        return mouseStrain ? mouseStrain.name : "";

    }

    private formatRegistrationTransforms(sample: ISample): string {
        if (sample.activeRegistrationTransformId.length === 0) {
            return "(click to set)";
        } else {
            return this.$scope.transformService.getDisplayNameForId(sample.activeRegistrationTransformId, "(name unspecified)");
        }
    }

    private formatMouseStrain(sample: ISample): string {
        if (sample.mouseStrainId !== null && sample.mouseStrainId.length > 0) {
            return this.$scope.mouseStrainService.getDisplayNameForId(sample.mouseStrainId);
        } else {
            return "(none)</i>";
        }
    }

    private formatInjections(sample: ISample): string {
        let injections = this.$scope.injectionService.injectionsForSample(sample.id);

        if (injections.length === 0) {
            return "(click to add)";
        } else if (injections.length < 3) {
            let str: string = "";
            injections.forEach((injection) => {
                str = str + ", " + this.$scope.injectionService.getDisplayName(injection);
            });
            return str.slice(2);
        } else {
            return injections.length + " injections";
        }
    }
}

angular.module("sampleManager").controller("sampleTableController", SampleTableController);
