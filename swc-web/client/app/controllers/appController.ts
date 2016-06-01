/// <reference path="../../../../shared/client/services/brainAreaService.ts"/>
/// <reference path="../../../../shared/client/services/injectionService.ts"/>
/// <reference path="../../../../shared/client/services/neuronService.ts"/>
/// <reference path="../../../../shared/client/services/sampleService.ts"/>
/// <reference path="../../../../shared/client/services/strainService.ts"/>
/// <reference path="../../../../shared/client/services/structureIdentifierService.ts"/>
/// <reference path="../../../../shared/client/services/tracingNodeService.ts"/>
/// <reference path="../../../../shared/client/services/tracingService.ts"/>
/// <reference path="../../../../shared/client/services/transformService.ts"/>
/// <reference path="../../../../shared/client/services/virusService.ts"/>

module TracingManager {
    'use strict';

    export class AppController {
        public static $inject = [
            '$scope',
            '$resource',
            'apiAccessService',
            'sampleService',
            'neuronService',
            'tracingService',
            'tracingNodeService',
            'structureIdentifierService'
        ];

        constructor(private $scope: any, private $resource: any, private serviceApi: ApiAccessService,
            private sampleService: SampleService, private neuronService: NeuronService,
            private tracingService: TracingService, private tracingNodeService: TracingNodeService,
            private structureIdentifierService: StructureIdentifierService) {
            $scope.service = serviceApi;
            $scope.sampleService = sampleService;
            $scope.neuronService = neuronService;
            $scope.tracingService = tracingService;
            $scope.tracingNodeService = tracingNodeService;
            $scope.structureIdentifierService = structureIdentifierService;

            $scope.$watch('service.serviceUrl', (val) => this.updateService(val));
            $scope.$watch('service.serviceDocUrl', (val) => this.updateServiceDoc(val));
            $scope.$watch('service.statusUrl', (val) => this.updateStatus(val));

            this.updateService(serviceApi.serviceUrl);
            this.updateServiceDoc(serviceApi.serviceDocUrl);
            this.updateStatus(serviceApi.statusUrl);
        }

        private updateService(val) {
            this.$scope.apiUrl = val;
        }

        private updateServiceDoc(val) {
            this.$scope.apiDocUrl = val;
        }

        private updateStatus(val) {
            this.$scope.statusUrl = val;
        }
    }

    angular.module('tracingManager').controller('appController', AppController);
}
