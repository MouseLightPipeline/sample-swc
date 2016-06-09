/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IRegistrationTransform extends ng.resource.IResource<IRegistrationTransform>, IApiItem {
    id: string;
    name: string;
    mutable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IRegistrationTransformResource extends IDataServiceResource<IRegistrationTransform> {
}

class RegistrationTransformService extends DataService<IRegistrationTransform> {
    public static $inject = [
        "$resource"
    ];

    constructor($resource: ng.resource.IResourceService) {
        super($resource);
    }

    protected mapQueriedItem(obj: any): IRegistrationTransform {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IRegistrationTransformResource {
        return <IRegistrationTransformResource>this.$resource(location + "transforms/:id", { id: "@id" }, {});
    }

    public get transforms(): any {
        return this.items;
    }
}
