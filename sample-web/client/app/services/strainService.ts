/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />

module SampleManager {
    'use strict';
    
    interface IStrain extends ng.resource.IResource<IStrain> {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }
    
    interface IStrainResource extends ng.resource.IResourceClass<IStrain> {
    }
    
    export class StrainService {
        public static $inject = [
            '$resource'
        ];    
        
        public strains: any = [];    
        
        private apiLocation: string;
        
        private defaultApi: IStrainResource;
        
        constructor(private $resource: ng.resource.IResourceService) {
        }
        
        public setLocation(location: string) {
            this.apiLocation = location;
            
            this.defaultApi = <IStrainResource>this.$resource(this.apiLocation + 'strains', {});
            
            this.defaultApi.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);
                    
                    return obj;
                });
                
                this.strains = data;
            });
        }
        
        public findIndex(id: string) : number {
            return this.strains.findIndex((element, index, array) => {
                return element.id === id;
            });
        }
    }

    angular.module('sampleManager').service('strainService', StrainService);
}
