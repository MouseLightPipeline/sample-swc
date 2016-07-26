/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IFluorophore extends IApiNamedResourceItem<IFluorophore> {
}

interface IFluorophoreResource extends IDataServiceResource<IFluorophore> {
}

class FluorophoreService extends DataService<IFluorophore> {

    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected mapQueriedItem(obj: any): IFluorophore {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IFluorophoreResource {
        return <IFluorophoreResource>this.$resource(location + "fluorophores/:id", {id: "@id"}, {});
    }

    public get fluorophores(): any {
        return this.items;
    }
}
