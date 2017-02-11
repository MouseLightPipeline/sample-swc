/// <reference path="../../bower_components/ndb-client-db/dist/@types/index.d.ts"/>

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
