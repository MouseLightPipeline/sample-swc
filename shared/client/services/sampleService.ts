/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="dataService.ts" />

'use strict';

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

class SampleService extends DataService<ISample> {
    public static $inject = [
        '$resource'
    ];

    private static directMappedProperties = ['id', 'idNumber', 'tag', 'comment', 'injectionLocationId'];

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
        return <ISampleResource>this.$resource(location + 'samples/:id', { id: '@id' }, {
            neurons: {
                method: 'GET',
                url: location + 'samples/:id/neurons/',
                params: { id: '@id' },
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
    
    public display(sample: ISample): string {
        if (sample.tag.length > 0) {
            return sample.idNumber.toString() + ' ' + sample.tag + ' (' + sample.sampleDate.toLocaleDateString() + ')';
        } else {
            return sample.idNumber.toString() + ' (' + sample.sampleDate.toLocaleDateString() + ')';
        }
    }
}
