/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />

module SampleManager {
    'use strict';
    
    interface ISample extends ng.resource.IResource<ISample> {
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }
    
    interface ISampleResource extends ng.resource.IResourceClass<ISample> {
    }
    
    export class SampleService {
        public static $inject = [
            '$resource'
        ];    
        
        public samples: any = [];  
        
        public isLoading: boolean = false;

        public lastCreationErrorMessage: string = '';  
        
        private apiLocation: string;
        
        private Sample: ISampleResource;
        
        constructor(private $resource: ng.resource.IResourceService) {
            this.isLoading = true;
        }
        
        public setLocation(location: string) {
            this.apiLocation = location;
            
            this.Sample = <ISampleResource>this.$resource(this.apiLocation + 'samples/:sampleId', {sampleId: '@id'});
            
            this.Sample.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);
                    
                    return obj;
                });
                
                this.samples = data;
                 
                this.isLoading = false;
           });
        }
        
        public createSample(data) {
            this.lastCreationErrorMessage = '';
            this.Sample.save(data).$promise.then((response) => {
                console.log(response);
                this.Sample.get({sampleId: response.id}, (sample) => {
                   this.samples.push(sample); 
                });
            }).catch((response) => {
                if (response && response.data) {
                    this.lastCreationErrorMessage = response.data.message; 
                }  
            });
        }
        
        public findIndex(id: string) : number {
            return this.samples.findIndex((element, index, array) => {
                return element.id === id;
            });
        }
    }

    angular.module('sampleManager').service('sampleService', SampleService);
}
