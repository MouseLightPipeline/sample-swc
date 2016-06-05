'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StrainService = (function (_super) {
    __extends(StrainService, _super);
    function StrainService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(StrainService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    StrainService.prototype.mapQueriedItem = function (obj) {
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    StrainService.prototype.createResource = function (location) {
        return this.$resource(location + 'strains', {});
    };
    Object.defineProperty(StrainService.prototype, "strains", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    StrainService.$inject = [
        '$resource'
    ];
    return StrainService;
}(DataService));
//# sourceMappingURL=strainService.js.map