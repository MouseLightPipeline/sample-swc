/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

'use strict';

interface IStrain extends ng.resource.IResource<IStrain> {
    id: string;
    name: string;
    mutable: boolean;
    virusId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IStrainResource extends IDataServiceResource<IStrain>, IApiItem {
}

class StrainService extends DataService<IStrain> {
    public static $inject = [
        '$resource'
    ];

    constructor($resource: ng.resource.IResourceService) {
        super($resource);
    }

    private get service(): IStrainResource {
        return <IStrainResource>this.dataSource;
    }

    protected mapQueriedItem(obj: any): IStrain {
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IStrainResource {
        return <IStrainResource>this.$resource(location + 'strains/:id', { id: '@id' }, {})
    }

    public get strains(): any {
        return this.items;
    }
}
