/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface ISample extends IApiNumberedResourceItem<ISample> {
    sampleDate: Date;
    tag: string;
    comment: string;
    mouseStrainId: string;
    registrationTransformId: string;
    injections: Array<string>;
}

interface ISampleResource extends IDataServiceResource<ISample> {
    injections(obj): ISample;
}

function lpad(n, width, z = "0"): string {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

class SampleService extends DataService<ISample> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    constructor($resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
        super($resource, $rootScope);
    }

    private get service(): ISampleResource {
        return <ISampleResource>this.dataSource;
    }

    protected mapQueriedItem(obj: any): ISample {
        obj.sampleDate = new Date(<string>obj.sampleDate);
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        obj.injections = [];

        return obj;
    }

    protected createResource(location: string): ISampleResource {
        return <ISampleResource>this.$resource(location + "samples/:id", { id: "@id" }, {
            injections: {
                method: "GET",
                url: location + "injections/sample/:id/",
                params: { id: "@id" },
                isArray: true
            }
        });
    }


    public mapChildren(items) {

        items.forEach((item: ISample) => {
            let injections = [];
            this.injectionsForSample(item.id).then((objs) => {
                objs.forEach((injection) => {
                    injections.push(injection.id);
                });
                this.$rootScope.$apply(() => {
                    item.injections = injections;
                });
             });
        });
    }

    public get samples(): any {
        return this.items;
    }

    public injectionsForSample(id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.service.injections({ id: id }).$promise.then(data => {
                resolve(data);
            }).catch((err) => {
                reject(err);
                console.log(err);
            });
        });
    }

    public getDisplayName(item: ISample, defaultValue: string = ""): string {
        let date: string = item.sampleDate.getFullYear() + "-" + lpad(item.sampleDate.getMonth() + 1, 2) + "-" + lpad(item.sampleDate.getDate(), 2);

        if (item.tag.length > 0) {
            return item.idNumber.toString() + " " + item.tag + " (" + date + ")";
        } else {
            return item.idNumber.toString() + " (" + date + ")";
        }
    }
}
