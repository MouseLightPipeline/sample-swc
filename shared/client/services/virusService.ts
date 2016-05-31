/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />

module ndbservices {
    'use strict';

    export interface IVirus extends ng.resource.IResource<IVirus>, IApiItem {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    export interface IVirusResource extends IDataServiceResource<IVirus> {
        strains(obj): IStrain;
    }

    export class VirusService extends DataService<IVirus> {
        public static $inject = [
            '$resource'
        ];

        constructor($resource: ng.resource.IResourceService) {
            super($resource);
        }

        private get service(): IVirusResource {
            return <IVirusResource>this.dataSource;
        }

        protected mapQueriedItem(obj: any): IInjection {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);

            return obj;
        }

        protected createResource(location: string): IVirusResource {
            return <IVirusResource>this.$resource(location + 'viruses', {}, {
                strains: {
                    method: 'GET',
                    url: location + 'viruses/:id/strains/',
                    params: { virusId: '@id' },
                    isArray: true
                }
            });
        }

        public get viruses(): any {
            return this.items;
        }

        public strainsForVirus(id: string) {
            return this.service.strains({ id: id }).$promise;
        }
    }

    angular.module('ndbservices').service('virusService', VirusService);
}
