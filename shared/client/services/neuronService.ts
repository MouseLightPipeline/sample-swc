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

    private neuronInjectionMap = {};

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    protected registerNewItem(obj: IInjection): INeuron {
        let item: INeuron = super.registerNewItem(obj) as INeuron;

        let list = this.neuronInjectionMap[item.injectionId];

        if (list === undefined || list === null) {
            list = [];
            this.neuronInjectionMap[item.injectionId] = list;
        }

        let index: number = list.indexOf(item.injectionId);

        if (index < 0) {
            list.push(item);
        } else {
            list[index] = item;
        }

        return item;
    }

    protected createResource(location: string): INeuronResource {
        return <INeuronResource>this.$resource(location + "neurons/:id", { id: "@id" });
    }

    public neuronsForInjection(injectionId: string): Array<IInjection> {
        let neurons = this.neuronInjectionMap[injectionId];

        if (neurons === undefined || neurons === null) {
            neurons = [];
            this.neuronInjectionMap[injectionId] = neurons;
        }

        return neurons;
    }

    public get neurons(): any {
        return this.items;
    }

    public getDisplayName(item: INeuron, defaultValue: string = ""): string {
        if (item === null) {
            return "";
        }

        if (item.tag.length > 0) {
            return item.idNumber.toString() + " " + item.tag ;
        } else {
            return item.idNumber.toString();
        }
    }
}
