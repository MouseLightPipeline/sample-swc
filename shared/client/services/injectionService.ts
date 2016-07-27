/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IInjection extends IApiItem {
    sampleId: string;
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
        "injectionVirusService",
        "brainAreaService"
    ];

    private injectionSampleMap = {};

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope,
                private injectionVirusService: InjectionVirusService, private brainAreaService: BrainAreaService) {
        super($resource, $rootScope);
    }

    protected registerNewItem(obj: IInjection): IInjection {
        let item: IInjection = super.registerNewItem(obj) as IInjection;

        let list = this.injectionSampleMap[item.sampleId];

        if (list === undefined || list === null) {
            list = [];
            this.injectionSampleMap[item.sampleId] = list;
        }

        let index: number = list.indexOf(item.sampleId);

        if (index < 0) {
            list.push(item);
        } else {
            list[index] = item;
        }

        return item;
    }

    protected createResource(location: string): IInjectionResource {
        return <IInjectionResource>this.$resource(location + "injections/:id", {id: "@id"}, {
            injectionsForSample: {
                method: "GET",
                url: location + "injections/sample/:id/",
                params: {id: "@id"},
                isArray: true
            }
        });
    }

    public injectionsForSample(sampleId: string): Array<IInjection> {
        let injections = this.injectionSampleMap[sampleId];

        if (injections === undefined || injections === null) {
            injections = [];
            this.injectionSampleMap[sampleId] = injections;
        }

        return injections;
    }


    public get injections(): any {
        return this.items;
    }

    public getDisplayName(item: IInjection, defaultValue: string = ""): string {
        return "(" + this.brainAreaService.getDisplayNameForId(item.brainAreaId) + ":" + this.injectionVirusService.getDisplayNameForId(item.injectionVirusId) + ")";
    }
}