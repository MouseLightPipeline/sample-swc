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
            
            this.$scope.$watch('sampleId', (newValue, oldValue) => {
                if (newValue !== oldValue) this.updateNeurons(newValue);
            });
            
            this.$scope.send = () => {this.send()};
            
            this.$scope.canCreateTracing = () : boolean => this.isValidTracingEntry();
        }
        
        private isValidTracingEntry(): boolean {
            return this.haveValidSample() && this.haveValidNeuron() && this.isValidAnnotator() && this.isValidFile() && this.isValidLength(this.$scope.lengthMicrometers);
        }
        
        private haveValidSample() : boolean {
            return this.$scope.sampleId.length > 0;
        }

        private haveValidNeuron() : boolean {
            return this.$scope.neuronId.length > 0;
        }
        
        private isValidLength(val: string) : boolean {
            return (val.length > 0) && !isNaN(Number(val));       
        }
       
        private isValidAnnotator() : boolean {
            return this.$scope.annotator.length > 0;   
        }
       
        private isValidFile() : boolean {
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
            let url = '/api/v1/upload';
            console.log(url);
            let fd = new FormData();
            
            fd.append('contents', this.$scope.theFile);
            
            this.$http.post(url, fd,  {
                params: {annotator: this.$scope.annotator, lengthMicrometers: this.$scope.lengthMicrometers, neuronId: this.$scope.neuronId},
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .then(() => {
                console.log('Uploaded ' + this.$scope.theFile.name);
            })
            .catch((error) => {
                console.log('Failed to upload ' + this.$scope.theFile);
                console.log(error)
            });
        }
    }

    angular.module('tracingManager').controller('createTracingController', CreateTracingController);
}
 