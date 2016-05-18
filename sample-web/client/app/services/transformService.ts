/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular-resource/index.d.ts" />

module SampleManager {
    'use strict';
    
    interface IRegistrationTransform extends ng.resource.IResource<IRegistrationTransform> {
        id: string;
        name: string;
        mutable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }
    
    interface IRegistrationTransformResource extends ng.resource.IResourceClass<IRegistrationTransform> {
    }
    
    export class RegistrationTransformService {
        public static $inject = [
            '$resource'
        ];    
        
        public transforms: any = [];    
        
        private apiLocation: string;
        
        private defaultApi: IRegistrationTransformResource;
        
        constructor(private $resource: ng.resource.IResourceService) {
        }
        
        public setLocation(location: string) {
            this.apiLocation = location;
            
            this.defaultApi = <IRegistrationTransformResource>this.$resource(this.apiLocation + 'transforms', {});
            
            this.defaultApi.query((data, headers) => {
                data = data.map((obj) => {
                    obj.createdAt = new Date(obj.createdAt);
                    obj.updatedAt = new Date(obj.updatedAt);
                    
                    return obj;
                });
                
                this.transforms = data;
            });
        }
        
        public findIndex(id: string) : number {
            return this.transforms.findIndex((element, index, array) => {
                return element.id === id;
            });
        }
    }

    angular.module('sampleManager').service('registrationTransformService', RegistrationTransformService);
}
