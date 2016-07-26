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
    injectionsForSample(obj): Array<string>;
}

class InjectionService extends DataService<IInjectionResourceItem> {

    public static $inject = [
        "$resource",
        "$rootScope",
        "injectionVirusService"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope, private injectionVirusService: InjectionVirusService) {
        super($resource, $rootScope);
    }

    private get service(): IInjectionResource {
        return <IInjectionResource>this.dataSource;
    }

    protected createResource(location: string): IInjectionResource {
        return <IInjectionResource>this.$resource(location + "injections/:id", {id: "@id"}, {
            injectionsForSample: {
                method: "GET",
                url: location + "injections/sample/:id/",
                params: { id: "@id" },
                isArray: true
            }
        });
    }

    public injectionsForSample(id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.service.injectionsForSample({ id: id }).$promise.then((injectionIds) => {
                let injections = injectionIds.map((injectionId) => {
                    return this[injectionId];
                });
                resolve(injections);
            }).catch((err) => {
                reject(err);
                console.log(err);
            });
        });
    }

    public get injections(): any {
        return this.items;
    }

    public getDisplayName(item: IInjection, defaultValue: string = ""): string {
        return this.injectionVirusService.getDisplayNameForId(item.injectionVirusId);
    }
}