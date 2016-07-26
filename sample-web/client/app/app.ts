/// <reference path="../../../shared/client/services/brainAreaService.ts"/>
/// <reference path="../../../shared/client/services/injectionService.ts"/>
/// <reference path="../../../shared/client/services/neuronService.ts"/>
/// <reference path="../../../shared/client/services/sampleService.ts"/>
/// <reference path="../../../shared/client/services/structureIdentifierService.ts"/>
/// <reference path="../../../shared/client/services/tracingNodeService.ts"/>
/// <reference path="../../../shared/client/services/tracingService.ts"/>
/// <reference path="../../../shared/client/services/registrationTransformService.ts"/>
/// <reference path="../../../shared/client/services/virusService.ts"/>
/// <reference path="../../../shared/client/services/MouseStrainService.ts"/>

((): void => {
    angular.module("sampleManager", ["ngResource", "ui.bootstrap", "ngAnimate"]);

    angular.module("sampleManager").service("brainAreaService", BrainAreaService);
    angular.module("sampleManager").service("injectionService", InjectionService);
    angular.module("sampleManager").service("neuronService", NeuronService);
    angular.module("sampleManager").service("sampleService", SampleService);
    angular.module("sampleManager").service("structureIdentifierService", StructureIdentifierService);
    angular.module("sampleManager").service("tracingNodeService", TracingNodeService);
    angular.module("sampleManager").service("tracingService", TracingService);
    angular.module("sampleManager").service("registrationTransformService", RegistrationTransformService);
    angular.module("sampleManager").service("virusService", VirusService);
    angular.module("sampleManager").service("mouseStrainService", MouseStrainService);
    angular.module("sampleManager").service("fluorophoreService", FluorophoreService);

})();
