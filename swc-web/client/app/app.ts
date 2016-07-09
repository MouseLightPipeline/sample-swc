/// <reference path="../../../shared/client/services/brainAreaService.ts"/>
/// <reference path="../../../shared/client/services/injectionService.ts"/>
/// <reference path="../../../shared/client/services/neuronService.ts"/>
/// <reference path="../../../shared/client/services/sampleService.ts"/>
/// <reference path="../../../shared/client/services/strainService.ts"/>
/// <reference path="../../../shared/client/services/structureIdentifierService.ts"/>
/// <reference path="../../../shared/client/services/tracingNodeService.ts"/>
/// <reference path="../../../shared/client/services/tracingService.ts"/>
/// <reference path="../../../shared/client/services/transformService.ts"/>
/// <reference path="../../../shared/client/services/virusService.ts"/>

((): void => {
    'use strict';

    var app = angular.module('tracingManager', ['ngResource', 'angularUtils.directives.dirPagination']);

    angular.module('tracingManager').service('brainAreaService', BrainAreaService);
    angular.module('tracingManager').service('injectionService', InjectionService);
    angular.module('tracingManager').service('neuronService', NeuronService);
    angular.module('tracingManager').service('sampleService', SampleService);
    angular.module('tracingManager').service('strainService', StrainService);
    angular.module('tracingManager').service('structureIdentifierService', StructureIdentifierService);
    angular.module('tracingManager').service('tracingNodeService', TracingNodeService);
    angular.module('tracingManager').service('tracingService', TracingService);
    angular.module('tracingManager').service('registrationTransformService', RegistrationTransformService);
    angular.module('tracingManager').service('virusService', VirusService);

})();
