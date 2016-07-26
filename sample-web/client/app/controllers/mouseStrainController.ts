/// <reference path="../../../../shared/client/services/mouseStrainService.ts"/>

class MouseStrainController {
    public static $inject = [
        "$scope"
    ];

    constructor(private $scope: any) {
    }

}

angular.module("sampleManager").controller("mouseStrainController", MouseStrainController);
