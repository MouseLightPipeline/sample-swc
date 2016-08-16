'use strict';

interface IQueryScope extends IAppScope {
    structureId: string;
    samples: any;
    isInQuery: boolean;
    queryResults: string;

    query();
}

class QueryController {
    public static $inject = [
        '$scope',
        '$resource'
    ];

    //private sampleApi: any;

    constructor(private $scope: IQueryScope, private $resource: any) {
        this.$scope.structureId = "";
        this.$scope.samples = [];
        this.$scope.isInQuery = false;
        this.$scope.queryResults = "";

        this.$scope.query = () => this.query();

        this.$scope.$watch('structureId', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.$scope.queryResults = "";
            }
        })
    }

    private query() {
        if (this.$scope.isInQuery)
            return;

        this.$scope.isInQuery = true;

        this.$scope.tracingNodeService.nodesForStructure(this.$scope.structureId).then((nodes: Array) => {
            this.$scope.$apply(() => {
                this.$scope.samples = nodes;
                this.$scope.isInQuery = false;
                this.$scope.queryResults = nodes.length + ((nodes.length == 1) ? ' match' : ' matches');
            })
        }).catch((err) => {
            this.$scope.$apply(() => {
                console.log(err);
                this.$scope.isInQuery = false;
                this.$scope.queryResults = err;
            })
        });
    }
}

angular.module('tracingManager').controller('queryController', QueryController);

 