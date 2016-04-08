/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SwcFile {
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

    angular.module('swcFileManager').controller('queryController', QueryController);
}
 