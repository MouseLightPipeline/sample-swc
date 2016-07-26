/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IVirus extends IApiNamedResourceItem<IVirus> {
}

interface IVirusResource extends IDataServiceResource<IVirus> {
}

class VirusService extends DataService<IVirus> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected mapQueriedItem(obj: any): IVirus {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IVirusResource {
        return <IVirusResource>this.$resource(location + "viruses/:id", {id: "@id"}, {});
    }

    public get viruses(): any {
        return this.items;
    }
}
