/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IBrainArea extends ng.resource.IResource<IBrainArea>, IApiItem {
    id: string;
    abiIdNumber: string;
    abiName: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IBrainAreaResource extends IDataServiceResource<IBrainArea> {
}

class BrainAreaService extends DataService<IBrainArea> {
    public static $inject = [
        "$resource"
    ];

    constructor($resource: ng.resource.IResourceService) {
        super($resource);
    }

    protected mapQueriedItem(obj: any): IBrainArea {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IBrainAreaResource {
        return <IBrainAreaResource>this.$resource(location + "brainareas/:id", { id: "@id" }, {});
    }

    public get brainAreas(): any {
        return this.items;
    }
}
