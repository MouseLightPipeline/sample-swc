/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface ITracingNode extends ng.resource.IResource<ITracingNode>, IApiItem {
}

interface ITracingNodeResource extends IDataServiceResource<ITracingNode> {
    nodesForStructure(obj): ITracingNode;
}

class TracingNodeService extends DataService<ITracingNode> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    private get service(): ITracingNodeResource {
        return <ITracingNodeResource>this.dataSource;
    }


    protected createResource(location: string): ITracingNodeResource {
        return <ITracingNodeResource>this.$resource(location + "nodes/:id", { id: "@id" }, {
            nodesForStructure: {
                method: "GET",
                url: location + "nodes/findByStructure/:id/",
                params: { id: "@id" },
                isArray: true
            }
        });
    }

    public get nodes(): any {
        return this.items;
    }

    public nodesForStructure(structureId: string): Promise<Array> {
        return new Promise<Array>((resolve, reject) => {
            this.service.nodesForStructure({ id: structureId }).$promise.then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
