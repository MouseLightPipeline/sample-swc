/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface INeuron extends IApiNumberedResourceItem<INeuron> {
    injectionId: string;
    brainAreaId: string;
    tag: string;
    keywords: string;
    x: number;
    y: number;
    z: number;
}

interface INeuronResource extends IDataServiceResource<INeuron> {
}

class NeuronService extends DataService<INeuron> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected createResource(location: string): INeuronResource {
        return <INeuronResource>this.$resource(location + "neurons/:id", { id: "@id" });
    }

    public get neurons(): any {
        return this.items;
    }
}
