/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

'use strict';

interface IInjection extends ng.resource.IResource<IInjection>, IApiItem {
    id: string;
    name: string;
    mutable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IInjectionResource extends IDataServiceResource<IInjection> {
}

class InjectionService extends DataService<IInjection> {

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
        return <IInjectionResource>this.$resource(location + 'injections/:id', { id: '@id' }, {})
    }

    public get injectionLocations(): any {
        return this.items;
    }
}
