'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StructureIdentifierService = (function (_super) {
    __extends(StructureIdentifierService, _super);
    function StructureIdentifierService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(StructureIdentifierService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    StructureIdentifierService.prototype.mapQueriedItem = function (obj) {
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    StructureIdentifierService.prototype.createResource = function (location) {
        return this.$resource(location + 'structures', {});
    };
    Object.defineProperty(StructureIdentifierService.prototype, "structures", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    StructureIdentifierService.$inject = [
        '$resource'
    ];
    return StructureIdentifierService;
}(DataService));
//# sourceMappingURL=structureIdentifierService.js.map