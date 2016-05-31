/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../../typings/globals/angular/index.d.ts"/>

module TracingManager {
    'use strict';

    export class ApiAccessService {
        public static $inject = [
            '$resource',
            '$location',
            'sampleService',
            'neuronService',
            'tracingService'
        ];        
        
        public haveService: boolean;
        public serviceUrl: string;        
        public serviceDocUrl: string;        
        public statusUrl: string;
        public sampleServiceUrl: string;
 
        private apiLocation: any;

        constructor(private $resource: any, private $location: any, private sampleService: ndbservices.SampleService,
            private neuronService: ndbservices.NeuronService, private tracingService: ndbservices.TracingService) {
            this.haveService = false;
            this.serviceUrl = '';
            this.serviceDocUrl = '';
            this.statusUrl = '';
            this.sampleServiceUrl = '';
           
            this.apiLocation = $resource('/service', {});
            
            this.apiLocation.get((api, headers) => this.update(api));
        }
        
        private update(api) {
            this.serviceUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/' + api.service.api + '/';
            this.serviceDocUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/docs';
            this.statusUrl = this.$location.host() + ':' + api.status.port;
            this.sampleServiceUrl = 'http://' + this.$location.host() + ':' + api.sampleService.port + '/' + api.sampleService.api + '/';
            
            this.haveService = true;
            
            this.sampleService.setLocation(this.sampleServiceUrl);
            this.neuronService.setLocation(this.sampleServiceUrl);
            this.tracingService.setLocation(this.serviceUrl);
        }
    }

    angular.module('tracingManager').service('apiAccessService', ApiAccessService);
}
