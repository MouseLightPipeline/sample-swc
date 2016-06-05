'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TracingService = (function (_super) {
    __extends(TracingService, _super);
    function TracingService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(TracingService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    TracingService.prototype.mapQueriedItem = function (obj) {
        obj.sampledate = new Date(obj.sampledate);
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    TracingService.prototype.createResource = function (location) {
        return this.$resource(location + 'tracings/:id', { id: '@id' }, {
            nodes: {
                method: 'GET',
                url: location + 'tracings/:id/nodes/',
                params: { id: '@id' },
                isArray: true
            }
        });
    };
    Object.defineProperty(TracingService.prototype, "tracings", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    TracingService.prototype.nodesForTracing = function (id) {
        return this.service.nodes({ id: id }).$promise;
    };
    TracingService.$inject = [
        '$resource'
    ];
    return TracingService;
}(DataService));
//# sourceMappingURL=tracingService.js.map