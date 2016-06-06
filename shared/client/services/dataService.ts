/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="../../typings/globals/es6-promise/index.d.ts" />

'use strict';

interface IApiItem {
    id: string;
}

interface IDataServiceResource<T extends ng.resource.IResource<T>> extends ng.resource.IResourceClass<T> {
}

interface ApiResourceItem<T> extends ng.resource.IResource<T>, IApiItem {
    
}

abstract class DataService<T extends ApiResourceItem<T>> {
    public static $inject = [
        '$resource'
    ];

    public resourcesAreAvailable: boolean = false;

    public items: any = [];

    private apiLocation: string = '';

    protected dataSource: IDataServiceResource<T>;

    constructor(protected $resource: ng.resource.IResourceService) {
    }

    public setLocation(reourceLocation: string) : Promise<boolean> {
        this.resourcesAreAvailable = false;

        this.apiLocation = reourceLocation;
        
        this.dataSource = this.createResource(this.apiLocation);

        return this.refreshData();
    }

    public refreshData() : Promise<boolean> {
        this.resourcesAreAvailable = false;

        return new Promise<boolean>((resolve, reject) => {
            this.dataSource.query((data, headers) => {
                data = data.map((obj) => {
                    var item : IApiItem = this.mapQueriedItem(obj);
                    this[item.id]= item;
                    return item;
                });

                this.items = data;

                this.resourcesAreAvailable = true;
                
                resolve(true);
            });
        });
    }

    public createItem(data): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.dataSource.save(data).$promise.then((item: T) => {
                this.dataSource.get({id: item.id}, (fullItem) => {
                    this.items.push(fullItem); 
                    resolve(fullItem);
                });
            }).catch((response) => {
                reject(response);
            });
        });
    }

    public findIndex(id: string): number {
        return this.items.findIndex((element, index, array) => {
            return element.id === id;
        });
    }

    public find(id: string): T {
        return this.items.find((obj) => {
            return obj.id === id;
        });
    }
    
    protected get apiUrl() {
        return this.apiLocation;
    }
    
    protected abstract mapQueriedItem(obj: any) : T;  
    
    protected abstract createResource(location: string) : IDataServiceResource<T>;
}
