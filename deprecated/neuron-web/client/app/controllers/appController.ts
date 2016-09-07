/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../../typings/globals/angular-resource/index.d.ts"/>

module TracingManager {
    'use strict';

    export class AppController {
        public static $inject = [
            '$scope',
            '$resource',
            'apiAccessService'
        ];

        constructor(private $scope: any, private $resource: any, private serviceApi: ApiAccessService) {
            $scope.service = serviceApi;

            $scope.$watch('service.serviceUrl', (val) => this.updateService(val));
            $scope.$watch('service.serviceDocUrl', (val) => this.updateServiceDoc(val));

            this.updateService(serviceApi.serviceUrl);
            this.updateServiceDoc(serviceApi.serviceDocUrl);
        }

        private updateService(val) {
            this.$scope.apiUrl = val;
        }

        private updateServiceDoc(val) {
            this.$scope.apiDocUrl = val;
        }
    }

    angular.module('ndb').controller('appController', AppController);
}
