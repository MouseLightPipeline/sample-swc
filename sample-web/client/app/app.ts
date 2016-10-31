/// <reference path="../../bower_components/ndb-client-db/dist/@types/index.d.ts"/>

((): void => {
    angular.module("sampleManager", ["ngResource", "ui.bootstrap", "ngAnimate", "toastr"]);

    angular.module("sampleManager").service("brainAreaService", BrainAreaService);
    angular.module("sampleManager").service("injectionVirusService", InjectionVirusService);
    angular.module("sampleManager").service("fluorophoreService", FluorophoreService);
    angular.module("sampleManager").service("injectionService", InjectionService);
    angular.module("sampleManager").service("registrationTransformService", RegistrationTransformService);
    angular.module("sampleManager").service("mouseStrainService", MouseStrainService);
    angular.module("sampleManager").service("sampleService", SampleService);
    angular.module("sampleManager").service("neuronService", NeuronService);
})();
