'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SampleService = (function (_super) {
    __extends(SampleService, _super);
    function SampleService($resource) {
        _super.call(this, $resource);
    }
    Object.defineProperty(SampleService.prototype, "service", {
        get: function () {
            return this.dataSource;
        },
        enumerable: true,
        configurable: true
    });
    SampleService.prototype.mapQueriedItem = function (obj) {
        obj.sampledate = new Date(obj.sampledate);
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);
        return obj;
    };
    SampleService.prototype.createResource = function (location) {
        return this.$resource(location + 'samples/:id', { id: '@id' }, {
            neurons: {
                method: 'GET',
                url: location + 'samples/:id/neurons/',
                params: { id: '@id' },
                isArray: true
            }
        });
    };
    Object.defineProperty(SampleService.prototype, "samples", {
        get: function () {
            return this.items;
        },
        enumerable: true,
        configurable: true
    });
    SampleService.prototype.neuronsForSample = function (id) {
        return this.service.neurons({ id: id }).$promise;
    };
    SampleService.$inject = [
        '$resource'
    ];
    return SampleService;
}(DataService));
//# sourceMappingURL=sampleService.js.map