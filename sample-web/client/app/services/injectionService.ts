/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />
/// <reference path="../../../typings/browser/ambient/es6-promise/index.d.ts" />

module SampleManager {
    'use strict';

    interface IInjection extends ng.resource.IResource<IInjection> {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IInjectionResource extends ng.resource.IResourceClass<IInjection> {
    }

    export class InjectionService {
        public static $inject = [
            '$resource'
        ];

        public resourcesAreAvailable: boolean;

        public injectionLocations: any = [];

        private apiLocation: string;

        private InjectionLocation: IInjectionResource;

        constructor(private $resource: ng.resource.IResourceService) {
        }

        public setLocation(reourceLocation: string) {
            this.resourcesAreAvailable = false;

            this.apiLocation = reourceLocation;

            this.InjectionLocation = <IInjectionResource>this.$resource(this.apiLocation + 'injections', {});

            this.refreshInjectionsLocations();
        }

        public createInjectionLocation(data): Promise<IInjection> {
            return new Promise<IInjection>((resolve, reject) => {
                this.InjectionLocation.save(data).$promise.then((injection: IInjection) => {
                    this.injectionLocations.push(injection);
                    resolve(injection);
                }).catch((response) => {
                    reject(response);
                });
            });
        }

        public refreshInjectionsLocations() {
            this.resourcesAreAvailable = false;

            this.InjectionLocation.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);

                    return obj;
                });

                this.injectionLocations = data;

                this.resourcesAreAvailable = true;
            });
        }

        public findIndex(id: string): number {
            return this.injectionLocations.findIndex((element, index, array) => {
                return element.id === id;
            });
        }

        public find(id: string): IInjection {
            return this.injectionLocations.find((obj) => {
                return obj.id === id;
            });
        }
    }

    angular.module('sampleManager').service('injectionService', InjectionService);
}
