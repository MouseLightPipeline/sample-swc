/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />

module ndbservices {
    'use strict';

    export interface IRegistrationTransform extends ng.resource.IResource<IRegistrationTransform>, IApiItem {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    export interface IRegistrationTransformResource extends IDataServiceResource<IRegistrationTransform> {
    }

    export class RegistrationTransformService extends DataService<IRegistrationTransform> {
        public static $inject = [
            '$resource'
        ];

        constructor($resource: ng.resource.IResourceService) {
            super($resource);
        }

        private get service(): IRegistrationTransformResource {
            return <IRegistrationTransformResource>this.dataSource;
        }

        protected mapQueriedItem(obj: any): IRegistrationTransform {
            obj.createdAt = new Date(obj.createdAt);
            obj.updatedAt = new Date(obj.updatedAt);

            return obj;
        }

        protected createResource(location: string): IRegistrationTransformResource {
            return <IRegistrationTransformResource>this.$resource(location + 'transforms', {})
        }

        public get transforms(): any {
            return this.items;
        }
    }

    angular.module('ndbservices').service('registrationTransformService', RegistrationTransformService);
}
