class TracingTableController {
    public static $inject = [
        '$scope'
    ];

    constructor(private $scope: any) {
        this.$scope.itemsPerPage = 10;
        this.$scope.currentPage = 1;

        this.$scope.$on('createdTracingIndex', (evt, val) => this.onCreatedTracingIndex(val));

        this.$scope.neuronDisplayForId = (id: string): any => {
            return this.neuronDisplayForId(id);
        };

        this.$scope.structureDisplayForId = (id: string): any => {
            return this.structureDisplayForId(id);
        };
    }

    private neuronDisplayForId(id: string): string {
        return this.$scope.neuronService.getDisplayNameForId(id);
    }

    private structureDisplayForId(id: string): string {
        return this.$scope.tracingStructureService.getDisplayNameForId(id);
    }

    private onCreatedTracingIndex(val) {
        var page: number = Math.floor(val / this.$scope.itemsPerPage) + 1;
        this.$scope.currentPage = page;
    }
}

angular.module('tracingManager').controller('tracingTableController', TracingTableController);

