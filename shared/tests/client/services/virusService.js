var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ndbservices;
(function (ndbservices) {
    'use strict';
    var VirusService = (function (_super) {
        __extends(VirusService, _super);
        function VirusService($resource) {
            _super.call(this, $resource);
        }
        Object.defineProperty(VirusService.prototype, "service", {
            get: function () {
                return this.dataSource;
            },
            enumerable: true,
            configurable: true
        });
        VirusService.prototype.mapQueriedItem = function (obj) {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);
            return obj;
        };
        VirusService.prototype.createResource = function (location) {
            return this.$resource(location + 'viruses', {}, {
                strains: {
                    method: 'GET',
                    url: location + 'viruses/:id/strains/',
                    params: { virusId: '@id' },
                    isArray: true
                }
            });
        };
        Object.defineProperty(VirusService.prototype, "viruses", {
            get: function () {
                return this.items;
            },
            enumerable: true,
            configurable: true
        });
        VirusService.prototype.strainsForVirus = function (id) {
            return this.service.strains({ id: id }).$promise;
        };
        VirusService.$inject = [
            '$resource'
        ];
        return VirusService;
    }(ndbservices.DataService));
    ndbservices.VirusService = VirusService;
    angular.module('ndbservices').service('virusService', VirusService);
})(ndbservices || (ndbservices = {}));
