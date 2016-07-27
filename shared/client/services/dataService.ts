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

    protected abstract createResource(location: string): IDataServiceResource<T>;

    protected get apiUrl() {
        return this.apiLocation;
    }

    public setLocation(resourceLocation: string): Promise<boolean> {
        this.resourcesAreAvailable = false;

        this.apiLocation = resourceLocation;

        this.dataSource = this.createResource(this.apiLocation);

        return this.refreshData();
    }

    protected mapQueriedItem(obj: any): IApiItem {
        obj.createdAt = new Date(<string>obj.createdAt);
        obj.updatedAt = new Date(<string>obj.updatedAt);

        return obj;
    }

    protected registerNewItem(obj: IApiItem): IApiItem {
        let item: IApiItem = this.mapQueriedItem(obj);

        this[item.id] = item;

        let index: number = this.items.findIndex((obj: IApiItem) => {
            return obj.id === item.id;
        });

        if (index > -1) {
            this.items[index] = item;
        } else {
            this.items.push(item);
        }

        return item;
    }

    protected registerNewItems(items) {
        items = items.map((obj: IApiItem) => {
            return this.registerNewItem(obj);
        });

        return items;
    }

    protected refreshDataWithCallback(fcn: any) {
        this.dataSource.query(fcn);
    }

    public refreshData(): Promise<boolean> {
        this.resourcesAreAvailable = false;

        this.items = [];

        return new Promise<boolean>((resolve) => {
            // Allows subclasses to do something other than a full query as the first call for data.
            this.refreshDataWithCallback((data) => {

                this.registerNewItems(data);

                this.resourcesAreAvailable = true;

                resolve(true);
            });
        });
    }

    public createItem(data): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.dataSource.save(data).$promise.then((obj: T) => {
                this.dataSource.get({id: obj.id}, (item) => {
                    item = this.registerNewItem(item);
                    resolve(item);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public find(id: string, fcn = null): T {
        let item: T;

        if (fcn === null) {
            item = this[id];
        } else {
            item = this.items.find(fcn);
        }

        if (item === undefined)
            item = null;

        return item;
    }

    public findWithIdNumber(id: number): T {
        return this.find("", (obj: IApiIdNumberItem) => {
            return obj.idNumber === id;
        });
    }

    public findWithName(name: string): T {
        return this.find("", (obj: IApiNamedItem) => {
            return obj.name.toLowerCase() === name.toLowerCase();
        });
    }

    public getDisplayName(item: T, defaultValue: string = ""): string {
        if ("name" in item)
            return item["name"];

        return defaultValue;
    }

    public getDisplayNameForId(id: string, defaultValue: string = ""): string {
        let item: T = this.find(id);

        return item === null ? defaultValue : this.getDisplayName(item);
    }
}
