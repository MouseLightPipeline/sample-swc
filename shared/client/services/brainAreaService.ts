/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface IBrainArea extends IApiNamedResourceItem<IBrainArea> {
    structureId: number;
    depth: number;
    parentStructureId: number;
    structureIdPath: string;
    name: string;
    safeName: string;
    acronym: string;
}

interface IBrainAreaResource extends IDataServiceResource<IBrainArea> {
    queryForDepth(obj): any;
    queryForParent(obj): any;
}

class BrainAreaDepthEntry {
    depth: number;
    areas: Array<IBrainArea>;
    selectedAreaIndex: number;
}

class BrainAreaService extends DataService<IBrainArea> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    private get service(): IBrainAreaResource {
        return <IBrainAreaResource>this.dataSource;
    }

    protected mapQueriedItem(obj: any): IBrainArea {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): IBrainAreaResource {
        return <IBrainAreaResource>this.$resource(location + "brainareas/:id", {id: "@id"}, {
            queryForDepth: {
                method: "GET",
                url: location + "brainareas/depth/:depth",
                params: {depth: "@depth"},
                isArray: true
            },
            queryForParent: {
                method: "GET",
                url: location + "brainareas/parent/:parentId",
                params: {parentId: "@parentId"},
                isArray: true
            }
        });
    }

    protected refreshDataWithCallback(fcn: any) {
        this.service.queryForDepth({depth: 0}).$promise.then(fcn);
    }

    public get brainAreas(): any {
        return this.items;
    }

    public brainAreasForDepth(depth: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.service.queryForDepth({depth: depth}).$promise.then((data) => {
                data = this.acceptNewItems(data);
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public brainAreasForParent(parentId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.service.queryForParent({parentId: parentId}).$promise.then((data) => {
                data = this.acceptNewItems(data);
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
