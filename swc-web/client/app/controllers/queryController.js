var TracingManager;
(function (TracingManager) {
    'use strict';
    var QueryController = (function () {
        function QueryController($scope, $resource) {
            var _this = this;
            this.$scope = $scope;
            this.$resource = $resource;
            this.$scope.structureId = '';
            this.$scope.samples = [];
            this.$scope.isInQuery = false;
            this.$scope.queryResults = '';
            this.$scope.query = function () { return _this.query(); };
            this.$scope.$watch('structureId', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    _this.$scope.queryResults = '';
                }
            });
        }
        QueryController.prototype.query = function () {
            var _this = this;
            if (this.$scope.isInQuery)
                return;
            this.$scope.isInQuery = true;
            this.$scope.tracingNodeService.nodesForStructure(this.$scope.structureId).then(function (nodes) {
                _this.$scope.samples = nodes;
                _this.$scope.isInQuery = false;
                _this.$scope.queryResults = nodes.length + ((nodes.length == 1) ? ' match' : ' matches');
            }).catch(function (error) {
                console.log(error);
                _this.$scope.isInQuery = false;
                _this.$scope.queryResults = error;
            });
        };
        QueryController.$inject = [
            '$scope',
            '$resource'
        ];
        return QueryController;
    }());
    TracingManager.QueryController = QueryController;
    angular.module('tracingManager').controller('queryController', QueryController);
})(TracingManager || (TracingManager = {}));
//# sourceMappingURL=queryController.js.map