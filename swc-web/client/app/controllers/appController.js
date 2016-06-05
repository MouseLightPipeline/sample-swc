var TracingManager;
(function (TracingManager) {
    'use strict';
    var AppController = (function () {
        function AppController($scope, $resource, serviceApi, sampleService, neuronService, tracingService, tracingNodeService, structureIdentifierService) {
            var _this = this;
            this.$scope = $scope;
            this.$resource = $resource;
            this.serviceApi = serviceApi;
            this.sampleService = sampleService;
            this.neuronService = neuronService;
            this.tracingService = tracingService;
            this.tracingNodeService = tracingNodeService;
            this.structureIdentifierService = structureIdentifierService;
            $scope.service = serviceApi;
            $scope.sampleService = sampleService;
            $scope.neuronService = neuronService;
            $scope.tracingService = tracingService;
            $scope.tracingNodeService = tracingNodeService;
            $scope.structureIdentifierService = structureIdentifierService;
            $scope.$watch('service.serviceUrl', function (val) { return _this.updateService(val); });
            $scope.$watch('service.serviceDocUrl', function (val) { return _this.updateServiceDoc(val); });
            $scope.$watch('service.statusUrl', function (val) { return _this.updateStatus(val); });
            this.updateService(serviceApi.serviceUrl);
            this.updateServiceDoc(serviceApi.serviceDocUrl);
            this.updateStatus(serviceApi.statusUrl);
        }
        AppController.prototype.updateService = function (val) {
            this.$scope.apiUrl = val;
        };
        AppController.prototype.updateServiceDoc = function (val) {
            this.$scope.apiDocUrl = val;
        };
        AppController.prototype.updateStatus = function (val) {
            this.$scope.statusUrl = val;
        };
        AppController.$inject = [
            '$scope',
            '$resource',
            'apiAccessService',
            'sampleService',
            'neuronService',
            'tracingService',
            'tracingNodeService',
            'structureIdentifierService'
        ];
        return AppController;
    }());
    TracingManager.AppController = AppController;
    angular.module('tracingManager').controller('appController', AppController);
})(TracingManager || (TracingManager = {}));
//# sourceMappingURL=appController.js.map