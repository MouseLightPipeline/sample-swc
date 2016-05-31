var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ndbservices;
(function (ndbservices) {
    'use strict';
    var BrainAreaService = (function (_super) {
        __extends(BrainAreaService, _super);
        function BrainAreaService($resource) {
            _super.call(this, $resource);
        }
        Object.defineProperty(BrainAreaService.prototype, "service", {
            get: function () {
                return this.dataSource;
            },
            enumerable: true,
            configurable: true
        });
        BrainAreaService.prototype.mapQueriedItem = function (obj) {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);
            return obj;
        };
        BrainAreaService.prototype.createResource = function (location) {
            return this.$resource(location + 'brainareas', {});
        };
        Object.defineProperty(BrainAreaService.prototype, "brainAreas", {
            get: function () {
                return this.items;
            },
            enumerable: true,
            configurable: true
        });
        BrainAreaService.$inject = [
            '$resource'
        ];
        return BrainAreaService;
    }(ndbservices.DataService));
    ndbservices.BrainAreaService = BrainAreaService;
    angular.module('ndbservices').service('brainAreaService', BrainAreaService);
})(ndbservices || (ndbservices = {}));
