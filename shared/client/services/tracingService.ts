/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="../../typings/globals/es6-promise/index.d.ts" />
/// <reference path="dataService.ts" />

"use strict";

interface ITracing extends ng.resource.IResource<ITracing>, IApiItem {
    id: string;
    filename: string;
    annotator: string;
    lengthMicrometers: number;
    neuronId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ITracingResource extends IDataServiceResource<ITracing> {
    nodes(obj): ITracing;
}

class TracingService extends DataService<ITracing> {
    public static $inject = [
        "$resource",
        "$rootScope",
        "$http"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope, private $http: ng.IHttpService) {
        super($resource, $rootScope);
    }

    private get service(): ITracingResource {
        return <ITracingResource>this.dataSource;
    }

    protected createResource(location: string): ITracingResource {
        return <ITracingResource>this.$resource(location + "tracings/:id", { id: "@id" }, {
            nodes: {
                method: "GET",
                url: location + "tracings/:id/nodes/",
                params: { id: "@id" },
                isArray: true
            }
        });
    }

    public get tracings(): any {
        return this.items;
    }

    public uploadSwcFile(theFile: any, tracingInfo: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url = this.apiUrl + "upload";

            let fd = new FormData();

            fd.append("contents", theFile);

            this.$http.post<ITracing>(url, fd, {
                params: tracingInfo,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined }
            }).then((result) => {
                this.dataSource.get({ id: result.data.id }, (fullItem) => {
                    this.items.push(fullItem);
                    resolve(fullItem);
                });
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    public nodesForTracing(id: string) {
        return this.service.nodes({ id: id }).$promise;
    }
}
