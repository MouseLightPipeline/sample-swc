/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

interface ISample extends ng.resource.IResource<ISample>, IApiItem {
    id: string;
    idNumber: number;
    sampleDate: Date;
    tag: string;
    comment: string;
    injectionLocationId: string;
    registrationTransformId: string;
    strainId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ISampleResource extends IDataServiceResource<ISample> {
    neurons(obj): ISample;
}

function lpad(n, width, z = "0"): string {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

class SampleService extends DataService<ISample> {
    public static $inject = [
        "$resource"
    ];

    constructor($resource: ng.resource.IResourceService) {
        super($resource);
    }

    private get service(): ISampleResource {
        return <ISampleResource>this.dataSource;
    }

    protected mapQueriedItem(obj: any): ISample {
        obj.sampleDate = new Date(<string>obj.sampleDate);
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected createResource(location: string): ISampleResource {
        return <ISampleResource>this.$resource(location + "samples/:id", { id: "@id" }, {
            neurons: {
                method: "GET",
                url: location + "samples/:id/neurons/",
                params: { id: "@id" },
                isArray: true
            }
        });
    }

    public get samples(): any {
        return this.items;
    }

    public neuronsForSample(id: string) {
        return this.service.neurons({ id: id }).$promise;
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
