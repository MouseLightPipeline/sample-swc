/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IMouseStrain extends IApiNamedResourceItem<IMouseStrain> {
}

interface IMouseStrainResource extends IDataServiceResource<IMouseStrain>, IApiItem {
}

class MouseStrainService extends DataService<IMouseStrain> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected createResource(location: string): IMouseStrainResource {
        return <IMouseStrainResource>this.$resource(location + "mousestrains/:id", { id: "@id" }, {});
    }

    public get mouseStrains(): any {
        return this.items;
    }
}
