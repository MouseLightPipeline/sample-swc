/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />

module SampleManager {
    'use strict';
    
    interface INeuron extends ng.resource.IResource<INeuron> {
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }
    
    interface INeuronResource extends ng.resource.IResourceClass<INeuron> {
    }
    
    export class NeuronService {
        public static $inject = [
            '$resource'
        ];    
        
        public neurons: any = [];  
        
        public isLoading: boolean = false;
        
        public lastCreationErrorMessage: string = '';  
        
        private apiLocation: string;
        
        private Neuron: INeuronResource;
        
        constructor(private $resource: ng.resource.IResourceService) {
            this.isLoading = true;
        }
        
        public setLocation(location: string) {
            this.apiLocation = location;
            
            this.Neuron = <INeuronResource>this.$resource(this.apiLocation + 'neurons/:neuronId', {neuronId: '@id'});
            
            this.Neuron.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);
                    
                    return obj;
                });
                
                this.neurons = data;
                
                this.isLoading = false;
            });
        }
        
        public createNeuron(data) {
            this.lastCreationErrorMessage = '';
            this.Neuron.save(data).$promise.then((response) => {
                console.log(response);
                this.Neuron.get({neuronId: response.id}, (neuron) => {
                   this.neurons.push(neuron); 
                });
            }).catch((response) => {
                if (response && response.data) {
                    this.lastCreationErrorMessage = response.data.message; 
                }  
            });
        }
        
        public findIndex(id: string) : number {
            return this.neurons.findIndex((element, index, array) => {
                return element.id === id;
            });
        }
    }

    angular.module('sampleManager').service('neuronService', NeuronService);
}
