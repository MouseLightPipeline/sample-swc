/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />

module ndbservices {
    'use strict';

    export interface ISample extends ng.resource.IResource<ISample>, IApiItem {
        id: string;
        idNumber: number,
        sampledate: Date,
        comment: string,
        createdAt: Date;
        updatedAt: Date;
    }

    export interface ISampleResource extends IDataServiceResource<ISample> {
        neurons(obj): ISample;
    }

    export class SampleService extends DataService<ISample> {
        public static $inject = [
            '$resource'
        ];

        constructor($resource: ng.resource.IResourceService) {
            super($resource);
        }

        private get service(): ISampleResource {
            return <ISampleResource>this.dataSource;
        }

        protected mapQueriedItem(obj: any): ISample {
            obj.sampledate = new Date(obj.sampledate);
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);

            return obj;
        }

        public createResource(location: string): ISampleResource {
            return <ISampleResource>this.$resource(location + 'samples/:id', { id: '@id' }, {
                neurons: {
                    method: 'GET',
                    url: location + 'samples/:id/neurons/',
                    params: { id: '@id' },
                    isArray: true
                }
            });
        }

        public get samples(): any {
            return this.items;
        }

        public neuronsForSample(id: string) {
            return this.service.neurons({ id: id }).$promise;
        }
    }

    angular.module('ndbservices').service('sampleService', SampleService);
}
