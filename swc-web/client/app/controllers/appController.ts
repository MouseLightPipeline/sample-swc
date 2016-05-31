/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../../typings/globals/angular/index.d.ts"/>

module TracingManager {
    'use strict';

    export class AppController {
        public static $inject = [
            '$scope',
            '$resource',
            'apiAccessService',
            'sampleService',
            'neuronService',
            'tracingService'
      ];        
        
        constructor(private $scope: any, private $resource: any, private serviceApi: ApiAccessService,
            private sampleService: ndbservices.SampleService, private neuronService: ndbservices.NeuronService,
            private tracingService: ndbservices.TracingService) {
            $scope.service = serviceApi;          
            $scope.sampleService = sampleService;
            $scope.neuronService = neuronService;
            $scope.tracingService = tracingService;
            
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
