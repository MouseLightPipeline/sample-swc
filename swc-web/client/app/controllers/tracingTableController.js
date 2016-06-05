var TracingManager;
(function (TracingManager) {
    'use strict';
    var TracingTableController = (function () {
        function TracingTableController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.$scope.neuronDisplayForId = function (id) {
                return _this.neuronDisplayForId(id);
            };
        }
        TracingTableController.prototype.neuronDisplayForId = function (id) {
            var obj = this.$scope.neuronService[id];
            if (obj == null) {
                return '(not found)';
            }
            else {
                return obj.idNumber + ' (' + obj.id + ')';
            }
        };
        TracingTableController.$inject = [
            '$scope'
        ];
        return TracingTableController;
    }());
    TracingManager.TracingTableController = TracingTableController;
    angular.module('tracingManager').controller('tracingTableController', TracingTableController);
})(TracingManager || (TracingManager = {}));
//# sourceMappingURL=tracingTableController.js.map