var TracingManager;
(function (TracingManager) {
    'use strict';
    var ApiAccessService = (function () {
        function ApiAccessService($resource, $location, sampleService, neuronService, tracingService, tracingNodeService, structureIdentifierService) {
            var _this = this;
            this.$resource = $resource;
            this.$location = $location;
            this.sampleService = sampleService;
            this.neuronService = neuronService;
            this.tracingService = tracingService;
            this.tracingNodeService = tracingNodeService;
            this.structureIdentifierService = structureIdentifierService;
            this.haveService = false;
            this.serviceUrl = '';
            this.serviceDocUrl = '';
            this.statusUrl = '';
            this.sampleServiceUrl = '';
            this.apiLocation = $resource('/service', {});
            this.apiLocation.get(function (api, headers) { return _this.update(api); });
        }
        ApiAccessService.prototype.update = function (api) {
            this.serviceUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/' + api.service.api + '/';
            this.serviceDocUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/docs';
            this.statusUrl = this.$location.host() + ':' + api.status.port;
            this.sampleServiceUrl = 'http://' + this.$location.host() + ':' + api.sampleService.port + '/' + api.sampleService.api + '/';
            this.haveService = true;
            this.sampleService.setLocation(this.sampleServiceUrl);
            this.neuronService.setLocation(this.sampleServiceUrl);
            this.tracingService.setLocation(this.serviceUrl);
            this.tracingNodeService.setLocation(this.serviceUrl);
            this.structureIdentifierService.setLocation(this.serviceUrl);
        };
        ApiAccessService.$inject = [
            '$resource',
            '$location',
            'sampleService',
            'neuronService',
            'tracingService',
            'tracingNodeService',
            'structureIdentifierService'
        ];
        return ApiAccessService;
    }());
    TracingManager.ApiAccessService = ApiAccessService;
    angular.module('tracingManager').service('apiAccessService', ApiAccessService);
})(TracingManager || (TracingManager = {}));
//# sourceMappingURL=apiAccessService.js.map