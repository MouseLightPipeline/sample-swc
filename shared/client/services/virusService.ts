/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />
/// <reference path="strainService.ts" />

interface IVirus extends ng.resource.IResource<IVirus>, IApiItem {
    id: string;
    name: string;
    mutable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IVirusResource extends IDataServiceResource<IVirus> {
    strains(obj): IStrain;
}

class VirusService extends DataService<IVirus> {
    public static $inject = [
        "$resource"
    ];

    constructor($resource: ng.resource.IResourceService) {
        super($resource);
    }

    private get service(): IVirusResource {
        return <IVirusResource>this.dataSource;
    }

    protected mapQueriedItem(obj: any): IVirus {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IVirusResource {
        return <IVirusResource>this.$resource(location + "viruses/:id", { id: "@id" }, {
            strains: {
                method: "GET",
                url: location + "viruses/:id/strains/",
                params: { virusId: "@id" },
                isArray: true
            }
        });
    }

    public get viruses(): any {
        return this.items;
    }

    public getDisplayName(item: IVirus, defaultValue: string = ""): string {
        return item.name;
    }

    public strainsForVirus(id: string): angular.IPromise<IVirus> {
        return this.service.strains({ id: id }).$promise;
    }
}
