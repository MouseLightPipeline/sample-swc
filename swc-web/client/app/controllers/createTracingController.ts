module TracingManager {
    'use strict';

    export class CreateTracingController {
        public static $inject = [
            '$scope',
            '$http'
        ];

        constructor(private $scope: any, private $http: any) {
            this.$scope.theFile = null;
            this.$scope.annotator = '';
            this.$scope.lengthMicrometers = '0';
            this.$scope.neuronId = '';
            this.$scope.sampleId = '';
            this.$scope.neuronsForSample = [];
            this.$scope.isInCreatePost = false;
            this.$scope.lastCreateMessage = '';

            this.$scope.$watch('sampleId', (newValue, oldValue) => {
                if (newValue !== oldValue) this.updateNeurons(newValue);
            });

            this.$scope.send = () => { this.send() };

            this.$scope.canCreateTracing = (): boolean => this.isValidTracingEntry();
        }

        private isValidTracingEntry(): boolean {
            return this.haveValidSample() && this.haveValidNeuron() && this.isValidAnnotator() && this.isValidFile() && this.isValidLength(this.$scope.lengthMicrometers);
        }

        private haveValidSample(): boolean {
            return this.$scope.sampleId.length > 0;
        }

        private haveValidNeuron(): boolean {
            return this.$scope.neuronId.length > 0;
        }

        private isValidLength(val: string): boolean {
            return (val.length > 0) && !isNaN(Number(val));
        }

        private isValidAnnotator(): boolean {
            return this.$scope.annotator.length > 0;
        }

        private isValidFile(): boolean {
            return (this.$scope.theFile != null) && (this.$scope.theFile.name.length > 0);
        }

        private updateNeurons(sampleId) {
            this.$scope.neuronId = '';
            if (!sampleId || sampleId.length == 0) {
                this.$scope.neuronsForSample = [];
            } else {
                this.$scope.neuronsForSample = this.$scope.sampleService.neuronsForSample(sampleId).then((response) => {
                    this.$scope.neuronsForSample = response;
                    if (response.length > 0) {
                        this.$scope.neuronId = response[0].id;
                    }
                }).catch((response) => {
                    this.$scope.neuronsForSample = [];
                });
            }
        }

        private send() {
            var tracingInfo = {
                annotator: this.$scope.annotator,
                lengthMicrometers: this.$scope.lengthMicrometers,
                neuronId: this.$scope.neuronId
            };

            this.$scope.isInCreatePost = true;
            this.$scope.lastCreateMessage = 'Submitting...';

            this.$scope.tracingService.uploadSwcFile(this.$scope.theFile, tracingInfo).then((tracing: ITracing) => {
                this.$scope.$apply(() => {
                    this.$scope.isInCreatePost = false;
                    this.$scope.lastCreateMessage = 'Success';
                    this.$scope.$emit('createdTracingIndex', this.$scope.tracingService.findIndex(tracing.id));
                });
            }).catch((error) => {
                this.$scope.$apply(() => {
                    this.$scope.isInCreatePost = false;
                    this.$scope.lastCreateMessage = error.data.message;
                });
            });
        }
    }

    angular.module('tracingManager').controller('createTracingController', CreateTracingController);
}
