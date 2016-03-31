/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SwcFile {
    'use strict';

    export class ServiceController {
        public static $inject = [
            '$scope',
            '$resource',
            'serviceApiService'
        ];        
        
        constructor(private $scope: any, private $resource: any, private serviceApi: ServiceApiService) {
            $scope.service = serviceApi;
            $scope.api = serviceApi.host;
            $scope.$watch('service.host', (val) => this.updateHost(val));
        }
        
        private updateHost(val) {
            this.$scope.api = val;
        }
    }

    angular.module('swcFileManager').controller('serviceController', ServiceController);
}
