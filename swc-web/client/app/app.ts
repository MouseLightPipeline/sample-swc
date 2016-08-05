/// <reference path="../../../shared/client/services/injectionService.ts"/>
/// <reference path="../../../shared/client/services/neuronService.ts"/>
/// <reference path="../../../shared/client/services/sampleService.ts"/>
/// <reference path="../../../shared/client/services/structureIdentifierService.ts"/>
/// <reference path="../../../shared/client/services/tracingNodeService.ts"/>
/// <reference path="../../../shared/client/services/tracingService.ts"/>
/// <reference path="../../../shared/client/services/injectionVirusService.ts"/>
/// <reference path="../../../shared/client/services/fluorophoreService.ts"/>

'use strict';

((): void => {
    angular.module('tracingManager', ['ngResource', 'angularUtils.directives.dirPagination', "ui.bootstrap", "ngAnimate"]);

    angular.module("tracingManager").service("brainAreaService", BrainAreaService);
    angular.module("tracingManager").service("injectionVirusService", InjectionVirusService);
    angular.module("tracingManager").service("fluorophoreService", FluorophoreService);
    angular.module("tracingManager").service("injectionService", InjectionService);
    angular.module("tracingManager").service("sampleService", SampleService);
    angular.module("tracingManager").service("neuronService", NeuronService);

    angular.module('tracingManager').service('structureIdentifierService', StructureIdentifierService);
    angular.module('tracingManager').service('tracingNodeService', TracingNodeService);
    angular.module('tracingManager').service('tracingService', TracingService);

})();
