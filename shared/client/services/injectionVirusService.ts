/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IInjectionVirus extends IApiNamedResourceItem<IInjectionVirus> {
}

interface IInjectionVirusResource extends IDataServiceResource<IInjectionVirus> {
}

class InjectionVirusService extends DataService<IInjectionVirus> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected createResource(location: string): IInjectionVirusResource {
        return <IInjectionVirusResource>this.$resource(location + "viruses/:id", {id: "@id"}, {});
    }

    public get injectionViruses(): any {
        return this.items;
    }
}
