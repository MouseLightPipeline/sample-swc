interface IInspectSampleScope extends IAppScope {
    title: string;
    sample: ISample;

    formatPossibleEmpty(str: string): string;
    formatSampleDate(date: string): string;
    formatTimestampDate(date: string): string;
    formatMouseStrain(sample: ISample): string;
    formatRegistrationTransforms(sample: ISample): string;
    formatInjections(sample: ISample): string;
    formatAdditionalRegistrationTransforms(sample: ISample): string;
}

class InspectSampleController implements IModalController<ISample> {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    constructor(private $scope: IInspectSampleScope, private modalService: ModalService) {
        this.modalService.registerInspectSampleController(this);

        this.$scope.formatPossibleEmpty = str => str || "(none)";
        this.$scope.formatSampleDate = date => moment(date).format("YYYY-MM-DD");
        this.$scope.formatTimestampDate = date => moment(date).format("YYYY-MM-DD hh:mm:ss.SSS");
        this.$scope.formatMouseStrain = sample => this.formatMouseStrain(sample);
        this.$scope.formatRegistrationTransforms = sample => this.formatRegistrationTransforms(sample);
        this.$scope.formatInjections = sample => this.formatInjections(sample);
        this.$scope.formatAdditionalRegistrationTransforms = sample => this.formatAdditionalRegistrationTransforms(sample);
    }

    public open(sample: ISample) {
        $("#inspectSampleModal").modal();

        this.$scope.sample = sample;
        this.$scope.title = `Sample ${this.$scope.sampleService.getDisplayName(sample)}`;
    }

    private formatMouseStrain(sample: ISample): string {
        if (sample && sample.mouseStrainId !== null && sample.mouseStrainId.length > 0) {
            return this.$scope.mouseStrainService.getDisplayNameForId(sample.mouseStrainId);
        } else {
            return "(none)";
        }
    }

    private formatRegistrationTransforms(sample: ISample): string {
        if (!sample || sample.activeRegistrationTransformId.length === 0) {
            return "(none)";
        } else {
            let transform = this.$scope.transformService.find(sample.activeRegistrationTransformId);
            return transform.location + "(" + this.$scope.transformService.getDisplayNameForId(sample.activeRegistrationTransformId, "(name unspecified)") + ")";
        }
    }

    private formatAdditionalRegistrationTransforms(sample: ISample): string {
        if (sample) {
            let transforms = this.$scope.transformService.registrationTransformsForSample(sample.id);

            if (transforms.length > 1) {
                return `${transforms.length - 1}`;
            } else {
                return "(none)";
            }
        } else {
            return "(none)";
        }
    }

    private formatInjections(sample: ISample): string {
        if (sample) {
            let injections = this.$scope.injectionService.injectionsForSample(sample.id);

            if (injections.length === 0) {
                return "(none)";
            } else if (injections.length < 3) {
                let str: string = "";
                injections.forEach((injection) => {
                    str = str + ", " + this.$scope.injectionService.getDisplayName(injection);
                });
                return str.slice(2);
            } else {
                return injections.length + " injections";
            }
        } else {
            return "(none)";
        }
    }
}

angular.module("sampleManager").controller("inspectSampleController", InspectSampleController);
