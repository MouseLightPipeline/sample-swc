/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SampleManager {
    'use strict';

    export class ServiceApiService {
        public static $inject = [
            '$resource'
        ];        
        
        public host: string;
        
        private api: any;

        constructor(private $resource: any) {
            this.host = '';
            
            this.api = $resource('/service', {});
            
            this.api.query((api, headers) => this.update(api));
        }
        
        private update(api) {
            console.log('Updating service host to: ' + api[0].service);
            this.host = api[0].service;
        }
    }

    angular.module('sampleManager').service('serviceApiService', ServiceApiService);
}
