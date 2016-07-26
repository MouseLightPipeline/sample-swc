/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IInjection extends IApiItem {
    brainAreaId: string;
    injectionVirusId: string;
    fluorophoreId: string;
}

interface IInjectionResourceItem extends IInjection, IApiResourceItem<IInjectionResourceItem> {
}

interface IInjectionResource extends IDataServiceResource<IInjectionResourceItem> {
}

class InjectionService extends DataService<IInjectionResourceItem> {

    public static $inject = [
        "$resource",
        "$rootScope",
        "virusService"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope, private virusService: VirusService) {
        super($resource, $rootScope);
    }

    protected mapQueriedItem(obj: any): IInjectionResourceItem {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IInjectionResource {
        return <IInjectionResource>this.$resource(location + "injections/:id", {id: "@id"}, {});
    }

    public get injections(): any {
        return this.items;
    }

    public getDisplayName(item: IInjection, defaultValue: string = ""): string {
        return this.virusService.getDisplayNameForId(item.injectionVirusId);
    }
}