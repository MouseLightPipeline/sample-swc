/// <reference path="../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../typings/globals/angular/index.d.ts"/>
/// <reference path="../../typings/globals/angular-resource/index.d.ts" />
/// <reference path="../../typings/globals/es6-promise/index.d.ts" />

interface IApiItem {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IApiIdNumberItem {
    idNumber: number;
}

interface IApiNamedItem {
    name: string;
}

interface IApiResourceItem<T> extends ng.resource.IResource<T>, IApiItem {
}

interface IApiNamedResourceItem<T> extends IApiResourceItem<T>, IApiNamedItem {
}

interface IApiNumberedResourceItem<T> extends IApiResourceItem<T>, IApiIdNumberItem {
}


interface IDataServiceResource<T extends IApiResourceItem<T>> extends ng.resource.IResourceClass<T> {
}

abstract class DataService<T extends IApiResourceItem<T>> {
    public static $inject = [
        "$resource",
        "$rootScope"
    ];

    public resourcesAreAvailable: boolean = false;

    public items: any = [];

    private apiLocation: string = "";

    protected dataSource: IDataServiceResource<T>;

    constructor(protected $resource: ng.resource.IResourceService, protected $rootScope: ng.IScope) {
    }

    public setLocation(resourceLocation: string): Promise<boolean> {
        this.resourcesAreAvailable = false;

        this.apiLocation = resourceLocation;

        this.dataSource = this.createResource(this.apiLocation);

        return this.refreshData();
    }

    public refreshData(): Promise<boolean> {
        this.resourcesAreAvailable = false;

        return new Promise<boolean>((resolve) => {
            this.refreshDataWithCallback((data) => {
                /*
                 data = data.map((obj) => {
                 let item: IApiItem = this.mapQueriedItem(obj);
                 this[item.id] = item;
                 return item;
                 });

                 this.mapChildren(data);
                 */

                data = this.acceptNewItems(data);

                this.items = data;

                this.resourcesAreAvailable = true;

                resolve(true);
            });
        });
    }

    protected acceptNewItems(items) {
        items = items.map((obj) => {
            let item: IApiItem = this.mapQueriedItem(obj);
            this[item.id] = item;
            return item;
        });

        this.mapChildren(items);

        return items;
    }

    public createItem(data): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.dataSource.save(data).$promise.then((item: T) => {
                this.dataSource.get({id: item.id}, (fullItem) => {
                    let mappedItem = this.mapQueriedItem(fullItem);
                    this.items.push(mappedItem);
                    resolve(mappedItem);
                });
            }).catch((response) => {
                reject(response);
            });
        });
    }

    public findIndex(id: string): number {
        return this.items.findIndex((element: IApiItem) => {
            return element.id === id;
        });
    }

    public find(id: string): Promise<T> {
        // let item: T = this.items.find((obj: IApiItem) => {
        //    return obj.id === id;
        // });

        return new Promise<T>((resolve, reject) => {
            let item: T = this[id];

            if (item === undefined) {
                this.dataSource.get({ id: id }).$promise.then(data => {
                    console.log(data);
                    data = this.acceptNewItems(data);
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(item);
            }
        });
    }

    public findWithIdNumber(id: number): T {
        let item: T = this.items.find((obj: IApiIdNumberItem) => {
            return obj.idNumber === id;
        });

        if (item === undefined)
            item = null;

        return item;
    }

    public findWithName(name: string): T {
        let item: T = this.items.find((obj: IApiNamedItem) => {
            return obj.name.toLowerCase() === name.toLowerCase();
        });

        if (item === undefined)
            item = null;

        return item;
    }

    public getDisplayName(item: T, defaultValue: string = ""): string {
        if ("name" in item)
            return item["name"];

        return defaultValue;
    }

    public getDisplayNameForId(id: string, defaultValue: string = ""): string {
        let item : T = this[id];

        if (item === undefined) {
            return defaultValue;
        } else {
            return this.getDisplayName(item);
        }
    }

    protected get apiUrl() {
        return this.apiLocation;
    }

    protected refreshDataWithCallback(fcn: any) {
        this.dataSource.query(fcn);
    }

    public mapChildren(items) {
    }

    protected abstract mapQueriedItem(obj: any): T;

    protected abstract createResource(location: string): IDataServiceResource<T>;
}
