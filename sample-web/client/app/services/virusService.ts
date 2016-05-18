/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />

module SampleManager {
    'use strict';
    
    interface IVirus extends ng.resource.IResource<IVirus> {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }
    
    interface IVirusResource extends ng.resource.IResourceClass<IVirus> {
        strains(obj): IVirus;
    }
    
    export class VirusService {
        public static $inject = [
            '$resource'
        ];    
        
        public viruses: any = [];    
        
        private apiLocation: string;
        
        private defaultApi: IVirusResource;
        
        constructor(private $resource: ng.resource.IResourceService) {
        }
        
        public setLocation(location: string) {
            this.apiLocation = location;
            
            this.defaultApi = <IVirusResource>this.$resource(this.apiLocation + 'viruses', {}, {
                strains: {
                    method: 'GET',
                    url: this.apiLocation + 'viruses/:virusId/strains/',
                    params: {virusId: '@virusId'},
                    isArray: true
                }
            });
            
            this.defaultApi.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);
                    
                    return obj;
                });
                
                this.viruses = data;
            });
        }
        
        public findIndex(id: string) : number {
            return this.viruses.findIndex((element, index, array) => {
                return element.id === id;
            });
        }        

        public find(id: string) : IVirus {
            return this.viruses.find((obj) => {
               return obj.id === id; 
            });
        }
        
        public strainsForVirus(id: string) {
            return this.defaultApi.strains({virusId: id}).$promise;
        }

    }

    angular.module('sampleManager').service('virusService', VirusService);
}
