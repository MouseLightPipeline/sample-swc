/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />

module ndbservices {
    'use strict';

    export interface ITracing extends ng.resource.IResource<ITracing>, IApiItem {
        id: string;
        filename: string,
        annotator: string,
        lengthMicrometers: number,
        neuronId: string,
        createdAt: Date;
        updatedAt: Date;
    }

    export interface ITracingResource extends IDataServiceResource<ITracing> {
        nodes(obj): ITracing;
    }

    export class TracingService extends DataService<ITracing> {
        public static $inject = [
            '$resource'
        ];

        constructor($resource: ng.resource.IResourceService) {
            super($resource);
        }

        private get service(): ITracingResource {
            return <ITracingResource>this.dataSource;
        }

        protected mapQueriedItem(obj: any): ITracing {
            obj.sampledate = new Date(obj.sampledate);
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);

            return obj;
        }

        public createResource(location: string): ITracingResource {
            return <ITracingResource>this.$resource(location + 'tracings/:id', { id: '@id' }, {
                nodes: {
                    method: 'GET',
                    url: location + 'tracings/:id/nodes/',
                    params: { id: '@id' },
                    isArray: true
                }
            });
        }

        public get tracings(): any {
            return this.items;
        }

        public nodesForTracing(id: string) {
            return this.service.nodes({ id: id }).$promise;
        }
    }

    angular.module('ndbservices').service('tracingService', TracingService);
}
