/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../../typings/globals/angular/index.d.ts"/>

module TracingManager {
    'use strict';

    export class QueryController {
        public static $inject = [
            '$scope',
            '$resource'
        ];
        
        private sampleApi: any;

        constructor(private $scope: any, private $resource: any) {            
            this.$scope.structureId = "1";
            this.$scope.samples = [];
            
            this.$scope.query = () => this.query();
            
            this.sampleApi = this.$resource('/api/v1/samples/findByStructure/:id');
        }
        
        private query() {            
            this.sampleApi.query({id: this.$scope.structureId}, (s) => {
                this.$scope.samples = s;
            });
        }
    }

    angular.module('tracingManager').controller('queryController', QueryController);
}
 