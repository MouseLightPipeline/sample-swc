'use strict';
var DataService = (function () {
    function DataService($resource) {
        this.$resource = $resource;
        this.resourcesAreAvailable = false;
        this.items = [];
    }
    DataService.prototype.setLocation = function (reourceLocation) {
        this.resourcesAreAvailable = false;
        this.apiLocation = reourceLocation;
        this.dataSource = this.createResource(this.apiLocation);
        return this.refreshData();
    };
    DataService.prototype.refreshData = function () {
        var _this = this;
        this.resourcesAreAvailable = false;
        return new Promise(function (resolve, reject) {
            _this.dataSource.query(function (data, headers) {
                data = data.map(function (obj) {
                    var item = _this.mapQueriedItem(obj);
                    _this[item.id] = item;
                    return item;
                });
                _this.items = data;
                _this.resourcesAreAvailable = true;
                resolve(true);
            });
        });
    };
    DataService.prototype.createItem = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dataSource.save(data).$promise.then(function (item) {
                _this.dataSource.get({ id: item.id }, function (fullItem) {
                    _this.items.push(fullItem);
                    resolve(item);
                });
            }).catch(function (response) {
                reject(response);
            });
        });
    };
    DataService.prototype.findIndex = function (id) {
        return this.items.findIndex(function (element, index, array) {
            return element.id === id;
        });
    };
    DataService.prototype.find = function (id) {
        return this.items.find(function (obj) {
            return obj.id === id;
        });
    };
    DataService.$inject = [
        '$resource'
    ];
    return DataService;
}());
//# sourceMappingURL=dataService.js.map