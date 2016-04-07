/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SwcFile {
    'use strict';

    export class ServiceApiService {
        public static $inject = [
            '$resource'
        ];        
        
        public host: string;
        
        private api: any;

        constructor(private $resource: any) {
            this.host = '(undefined)';
            
            this.api = $resource('/service', {});
            
            this.api.query((api, headers) => this.update(api));
        }
        
        private update(api) {
            console.log(api[0].service);
            this.host = api[0].service;
        }
    }

    angular.module('swcFileManager').service('serviceApiService', ServiceApiService);
}
