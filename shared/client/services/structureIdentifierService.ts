/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />


interface IStructureIdentifier extends IApiNamedResourceItem<IStructureIdentifier> {
    value: number;
}

interface IStructureIdentifierResource extends IDataServiceResource<IStructureIdentifier> {
}

class StructureIdentifierService extends DataService<IStructureIdentifier> {

    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected createResource(location: string): IStructureIdentifierResource {
        return <IStructureIdentifierResource>this.$resource(location + "structures/:id", { id: "@id" }, {});
    }

    public get structures(): any {
        return this.items;
    }
}
