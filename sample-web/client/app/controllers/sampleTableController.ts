/// <reference path="../../../../shared/client/services/sampleService.ts"/>

class SampleTableController {
    public static $inject = [
        "$scope"
    ];

    constructor(private $scope: any) {

        this.$scope.injectionsForSample = {};

        this.$scope.formatRegistrationTransform = (registrationTransformId) => {
            return this.formatRegistrationTransform(registrationTransformId);
        };

        this.$scope.formatMouseStrain = (mouseStrainId: string) => {
            return this.formatMouseStrain(mouseStrainId);
        };

        this.$scope.formatInjections = (sample: ISample) => {
            return this.formatInjections(sample);
        };

        this.$scope.$on("injectionAdded", (evt, sample, injection) => {
            this.$scope.$apply(() => {
                // sample.injections.push(injection.id);
            })
        });

        this.$scope.$watchCollection("sampleService.samples", () => this.onSampleCollectionChanged());

        this.$scope.$watchCollection("injectionsService.injections", () => this.onInjectionCollectionChanged());
    }

    private onSampleCollectionChanged() {
    }

    private onInjectionCollectionChanged() {
    }

    private formatRegistrationTransform(registrationTransformId: string): string {
        if (registrationTransformId !== null && registrationTransformId.length > 0) {
            return this.$scope.transformService.getDisplayNameForId(registrationTransformId);
        } else {
            return "(none)";
        }
    }

    private formatMouseStrain(mouseStrainId: string): string {
        if (mouseStrainId !== null && mouseStrainId.length > 0) {
            return this.$scope.mouseStrainService.getDisplayNameForId(mouseStrainId);
        } else {
            return "(none)";
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
