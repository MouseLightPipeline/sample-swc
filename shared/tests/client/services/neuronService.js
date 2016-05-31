var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ndbservices;
(function (ndbservices) {
    'use strict';
    var NeuronService = (function (_super) {
        __extends(NeuronService, _super);
        function NeuronService($resource) {
            _super.call(this, $resource);
        }
        Object.defineProperty(NeuronService.prototype, "service", {
            get: function () {
                return this.dataSource;
            },
            enumerable: true,
            configurable: true
        });
        NeuronService.prototype.mapQueriedItem = function (obj) {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);
            return obj;
        };
        NeuronService.prototype.createResource = function (location) {
            return this.$resource(location + 'neurons/:id', { id: '@id' });
        };
        Object.defineProperty(NeuronService.prototype, "neurons", {
            get: function () {
                return this.items;
            },
            enumerable: true,
            configurable: true
        });
        NeuronService.$inject = [
            '$resource'
        ];
        return NeuronService;
    }(ndbservices.DataService));
    ndbservices.NeuronService = NeuronService;
    angular.module('ndbservices').service('neuronService', NeuronService);
})(ndbservices || (ndbservices = {}));
