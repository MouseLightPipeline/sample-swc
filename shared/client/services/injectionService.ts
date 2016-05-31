/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />

module ndbservices {
    'use strict';

    export interface IInjection extends ng.resource.IResource<IInjection>, IApiItem {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    export interface IInjectionResource extends IDataServiceResource<IInjection> {
    }

    export class InjectionService extends DataService<IInjection> {

        public static $inject = [
            '$resource'
        ];

        constructor($resource: ng.resource.IResourceService) {
            super($resource);
        }

        private get service(): IInjectionResource {
            return <IInjectionResource>this.dataSource;
        }

        protected mapQueriedItem(obj: any): IInjection {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);

            return obj;
        }

        protected createResource(location: string): IInjectionResource {
            return <IInjectionResource>this.$resource(location + 'injections', {})
        }

        public get injectionLocations(): any {
            return this.items;
        }
    }

    angular.module('ndbservices').service('injectionService', InjectionService);
}
