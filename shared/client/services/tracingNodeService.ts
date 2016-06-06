/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

'use strict';

interface ITracingNode extends ng.resource.IResource<ITracingNode>, IApiItem {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ITracingNodeResource extends IDataServiceResource<ITracingNode> {
    nodesForStructure(obj): ITracingNode;
}

class TracingNodeService extends DataService<ITracingNode> {
    public static $inject = [
        '$resource'
    ];

    constructor($resource: ng.resource.IResourceService) {
        super($resource);
    }

    private get service(): ITracingNodeResource {
        return <ITracingNodeResource>this.dataSource;
    }

    protected mapQueriedItem(obj: any): ITracingNode {
        obj.sampledate = new Date(obj.sampledate);
        obj.createdAt = new Date(obj.createdAt);
        obj.updatedAt = new Date(obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): ITracingNodeResource {
        return <ITracingNodeResource>this.$resource(location + 'nodes/:id', { id: '@id' }, {
            nodesForStructure: {
                method: 'GET',
                url: location + 'nodes/findByStructure/:id/',
                params: { id: '@id' },
                isArray: true
            }
        });
    }

    public get nodes(): any {
        return this.items;
    }

    public nodesForStructure(structureId: string) {
        return this.service.nodesForStructure({ id: structureId }).$promise;
    }
}
