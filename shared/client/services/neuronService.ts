/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />

module ndbservices {
    'use strict';
    
    export interface INeuron extends ng.resource.IResource<INeuron>, IApiItem {
        id: string;
        sampleId: string;
        createdAt: Date;
        updatedAt: Date;
    }
    
    export interface INeuronResource extends IDataServiceResource<INeuron> {
    }
    
    export class NeuronService extends DataService<INeuron> {
        public static $inject = [
            '$resource'
        ];    
        
        constructor($resource: ng.resource.IResourceService) {
            super($resource);
        }

        private get service(): INeuronResource {
            return <INeuronResource>this.dataSource;
        }        

        protected mapQueriedItem(obj: any) : INeuron {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);

            return obj;
        }
        
        public createResource(location: string) : INeuronResource {  
            return <INeuronResource>this.$resource(location + 'neurons/:id', {id: '@id'});          
        }
        
        public get neurons() : any {
            return this.items;
        }
    }

    angular.module('ndbservices').service('neuronService', NeuronService);
}
