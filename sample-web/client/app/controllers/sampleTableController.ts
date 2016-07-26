/// <reference path="../../../../shared/client/services/sampleService.ts"/>

class SampleTableController {
    public static $inject = [
        "$scope"
    ];

    constructor(private $scope: any) {

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

    private formatInjections(injections) {
        if (injections.length === 0) {
            return "(none)";
        } else {
            // let str = "";
            // injections.forEach((obj: string) => {
            //     let injection = this.$scope.injectionService.find(obj);
            //     str = str + ", " + this.$scope.injectionService.getDisplayName(injection);
            // })

            // return str.slice(2);
            return injections.length;
        }
    }
}

angular.module("sampleManager").controller("sampleTableController", SampleTableController);
