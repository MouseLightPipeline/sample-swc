'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RegistrationTransformService = (function (_super) {
    __extends(RegistrationTransformService, _super);
    function RegistrationTransformService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(RegistrationTransformService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    RegistrationTransformService.prototype.mapQueriedItem = function (obj) {
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    RegistrationTransformService.prototype.createResource = function (location) {
        return this.$resource(location + 'transforms', {});
    };
    Object.defineProperty(RegistrationTransformService.prototype, "transforms", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    RegistrationTransformService.$inject = [
        '$resource'
    ];
    return RegistrationTransformService;
}(DataService));
//# sourceMappingURL=transformService.js.map