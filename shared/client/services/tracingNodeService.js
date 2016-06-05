'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TracingNodeService = (function (_super) {
    __extends(TracingNodeService, _super);
    function TracingNodeService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(TracingNodeService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    TracingNodeService.prototype.mapQueriedItem = function (obj) {
        obj.sampledate = new Date(obj.sampledate);
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    TracingNodeService.prototype.createResource = function (location) {
        return this.$resource(location + 'nodes/:id', { id: '@id' }, {
            nodesForStructure: {
                method: 'GET',
                url: location + 'nodes/findByStructure/:id/',
                params: { id: '@id' },
                isArray: true
            }
        });
    };
    Object.defineProperty(TracingNodeService.prototype, "nodes", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    TracingNodeService.prototype.nodesForStructure = function (structureId) {
        return this.service.nodesForStructure({ id: structureId }).$promise;
    };
    TracingNodeService.$inject = [
        '$resource'
    ];
    return TracingNodeService;
}(DataService));
//# sourceMappingURL=tracingNodeService.js.map