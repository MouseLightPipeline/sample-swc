/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SampleManager {
    'use strict';

    export class AppController {
        public static $inject = [
            '$scope',
            '$resource',
            'apiAccessService',
            'injectionService',
            'registrationTransformService',
            'virusService',
            'strainService',
            'brainAreaService',
            'sampleService',
            'neuronService'
        ];        
        
        constructor(private $scope: any, private $resource: any, private serviceApi: ApiAccessService, 
            private injectionService: ndbservices.InjectionService, private transformService: ndbservices.RegistrationTransformService,
            private virusService: ndbservices.VirusService, private strainService: ndbservices.StrainService, private brainAreaService: ndbservices.BrainAreaService,
            private sampleService: ndbservices.SampleService, private neuronService: ndbservices.NeuronService) {
            
            $scope.service = serviceApi;
            $scope.injectionService = injectionService;
            $scope.transformService = transformService;
            $scope.virusService = virusService;
            $scope.strainService = strainService;
            $scope.brainAreaService = brainAreaService;
            $scope.sampleService = sampleService;
            $scope.neuronService = neuronService;
            
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

    angular.module('sampleManager').controller('appController', AppController);
}
