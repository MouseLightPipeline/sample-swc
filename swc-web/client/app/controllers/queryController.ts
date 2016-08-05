'use strict';

class QueryController {
    public static $inject = [
        '$scope',
        '$resource'
    ];

    //private sampleApi: any;

    constructor(private $scope: any, private $resource: any) {
        this.$scope.structureId = '';
        this.$scope.samples = [];
        this.$scope.isInQuery = false;
        this.$scope.queryResults = '';

        this.$scope.query = () => this.query();

        this.$scope.$watch('structureId', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.$scope.queryResults = '';
            }
        })
    }

    private query() {
        if (this.$scope.isInQuery)
            return;

        this.$scope.isInQuery = true;

        this.$scope.tracingNodeService.nodesForStructure(this.$scope.structureId).then((nodes) => {
            this.$scope.samples = nodes;
            this.$scope.isInQuery = false;
            this.$scope.queryResults = nodes.length + ((nodes.length == 1) ? ' match' : ' matches');
        }).catch((error) => {
            console.log(error);
            this.$scope.isInQuery = false;
            this.$scope.queryResults = error;
        });
    }
}

angular.module('tracingManager').controller('queryController', QueryController);

 