var TracingManager;
(function (TracingManager) {
    'use strict';
    var CreateTracingController = (function () {
        function CreateTracingController($scope, $http) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$scope.theFile = null;
            this.$scope.annotator = '';
            this.$scope.lengthMicrometers = '0';
            this.$scope.neuronId = '';
            this.$scope.sampleId = '';
            this.$scope.neuronsForSample = [];
            this.$scope.$watch('sampleId', function (newValue, oldValue) {
                if (newValue !== oldValue)
                    _this.updateNeurons(newValue);
            });
            this.$scope.send = function () { _this.send(); };
            this.$scope.canCreateTracing = function () { return _this.isValidTracingEntry(); };
        }
        CreateTracingController.prototype.isValidTracingEntry = function () {
            return this.haveValidSample() && this.haveValidNeuron() && this.isValidAnnotator() && this.isValidFile() && this.isValidLength(this.$scope.lengthMicrometers);
        };
        CreateTracingController.prototype.haveValidSample = function () {
            return this.$scope.sampleId.length > 0;
        };
        CreateTracingController.prototype.haveValidNeuron = function () {
            return this.$scope.neuronId.length > 0;
        };
        CreateTracingController.prototype.isValidLength = function (val) {
            return (val.length > 0) && !isNaN(Number(val));
        };
        CreateTracingController.prototype.isValidAnnotator = function () {
            return this.$scope.annotator.length > 0;
        };
        CreateTracingController.prototype.isValidFile = function () {
            return (this.$scope.theFile != null) && (this.$scope.theFile.name.length > 0);
        };
        CreateTracingController.prototype.updateNeurons = function (sampleId) {
            var _this = this;
            this.$scope.neuronId = '';
            if (!sampleId || sampleId.length == 0) {
                this.$scope.neuronsForSample = [];
            }
            else {
                this.$scope.neuronsForSample = this.$scope.sampleService.neuronsForSample(sampleId).then(function (response) {
                    _this.$scope.neuronsForSample = response;
                    if (response.length > 0) {
                        _this.$scope.neuronId = response[0].id;
                    }
                }).catch(function (response) {
                    _this.$scope.neuronsForSample = [];
                });
            }
        };
        CreateTracingController.prototype.send = function () {
            var _this = this;
            var url = '/api/v1/upload';
            console.log(url);
            var fd = new FormData();
            fd.append('contents', this.$scope.theFile);
            this.$http.post(url, fd, {
                params: { annotator: this.$scope.annotator, lengthMicrometers: this.$scope.lengthMicrometers, neuronId: this.$scope.neuronId },
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function () {
                console.log('Uploaded ' + _this.$scope.theFile.name);
            })
                .catch(function (error) {
                console.log('Failed to upload ' + _this.$scope.theFile);
                console.log(error);
            });
        };
        CreateTracingController.$inject = [
            '$scope',
            '$http'
        ];
        return CreateTracingController;
    }());
    TracingManager.CreateTracingController = CreateTracingController;
    angular.module('tracingManager').controller('createTracingController', CreateTracingController);
})(TracingManager || (TracingManager = {}));
//# sourceMappingURL=createTracingController.js.map