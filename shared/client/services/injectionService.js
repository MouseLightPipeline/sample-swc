'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InjectionService = (function (_super) {
    __extends(InjectionService, _super);
    function InjectionService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(InjectionService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    InjectionService.prototype.mapQueriedItem = function (obj) {
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    InjectionService.prototype.createResource = function (location) {
        return this.$resource(location + 'injections', {});
    };
    Object.defineProperty(InjectionService.prototype, "injectionLocations", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    InjectionService.$inject = [
        '$resource'
    ];
    return InjectionService;
}(DataService));
//# sourceMappingURL=injectionService.js.map