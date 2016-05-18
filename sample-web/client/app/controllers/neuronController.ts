/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SampleManager {
    'use strict';

    export class NeuronController {
        public static $inject = [
            '$scope',
            '$http',
            '$resource'
        ];

        constructor(private $scope: any, private $http: any, private $resource: any) {
            var today = new Date();
            
            this.$scope.model = {};
            this.$scope.model.idNumber = '1';
            this.$scope.model.sampleId = '';
            this.$scope.model.brainAreaId = '';
            this.$scope.model.x = 0;
            this.$scope.model.y = 0;
            this.$scope.model.z = 0;
            
            this.$scope.strainsForVirus = [];
            
            this.$scope.isValidIdNumber = false;
            this.$scope.isValidDate = false;
            
            this.$scope.$watch('model.idNumber', (newValue, oldValue) => {
                this.$scope.isValidIdNumber = this.isValidIdNumberValue(newValue);
            });
            
            this.$scope.createNeuron = () => this.createNeuron();
            
            this.$scope.canCreateNeuron = () : boolean => this.isValidNeuronEntry();
       }
        
        private isValidNeuronEntry(): boolean {
            return this.$scope.isValidIdNumber && this.haveValidSample() && this.haveValidBrainArea();
        }
                
        private isValidIdNumberValue(val: string) : boolean {
            return !isNaN(Number(val)) && Number.isInteger(Number(val));       
        }
        
        private haveValidSample() : boolean {
            return this.$scope.model.sampleId.length > 0;
        }

        private haveValidBrainArea() : boolean {
            return this.$scope.model.brainAreaId.length > 0;
        }

        private createNeuron() {                       
            var neuron = {
                idNumber: parseInt(this.$scope.model.idNumber),
                sampleId: this.$scope.model.sampleId,
                brainAreaId: this.$scope.model.brainAreaId,
                x: parseFloat(this.$scope.model.x),
                y: parseFloat(this.$scope.model.y),
                z: parseFloat(this.$scope.model.z)
            };

            this.$scope.neuronService.createNeuron(neuron);
        }
    }

    angular.module('sampleManager').controller('neuronController', NeuronController);
}
