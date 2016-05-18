/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />

module SampleManager {
    'use strict';
    
    interface IBrainArea extends ng.resource.IResource<IBrainArea> {
        abiIdNumber: string;
        abiName: string;
        createdAt: Date;
        updatedAt: Date;
    }
    
    interface IBrainAreaResource extends ng.resource.IResourceClass<IBrainArea> {
    }
    
    export class BrainAreaService {
        public static $inject = [
            '$resource'
        ];    
        
        public brainAreas: any = [];    
        
        private apiLocation: string;
        
        private defaultApi: IBrainAreaResource;
        
        constructor(private $resource: ng.resource.IResourceService) {
        }
        
        public setLocation(location: string) {
            this.apiLocation = location;
            
            this.defaultApi = <IBrainAreaResource>this.$resource(this.apiLocation + 'brainareas', {});
            
            this.defaultApi.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);
                    
                    return obj;
                });
                
                this.brainAreas = data;
            });
        }
        
        public findIndex(id: string) : number {
            return this.brainAreas.findIndex((element, index, array) => {
                return element.id === id;
            });
        }
    }

    angular.module('sampleManager').service('brainAreaService', BrainAreaService);
}
