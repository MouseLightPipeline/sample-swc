enum ESelectOrCreateMode {
    Select,
    Create
}

interface ICreateItemScope<T extends IApiNamedItem, S> extends IAppScope {
    name: string;
    existingItems: T[];
    selectedItem: T;
    actionText: string;
    actionMode: ESelectOrCreateMode;
    errorMessage: string;
    callerContext: S;

    onReferenceExistingItem(item: T): void;
    onCreateOrSelectItemClicked(): void;
}

interface ICreateItemEventContext {
    modalElementId?: string;
    itemCreatedEventName?: string;
    itemSelectedEventName?: string;
}

interface ICreateItemEventData<C, T extends IApiNamedItem> {
    callerContext: C;
    item: T;
}

abstract class SelectItemController<T extends IApiNamedItem, S> implements IModalController<S> {
    constructor(protected $scope: ICreateItemScope<T, S>, protected service: DataService<T>, private context: ICreateItemEventContext) {
        this.$scope.onReferenceExistingItem = (item) => this.onReferenceExistingItem(item);

        this.$scope.onCreateOrSelectItemClicked = () => this.onCreateOrSelectItemClicked();

        this.$scope.$watch("name", () => this.onNameChanged(this.$scope.name));

        this.onOpenWindow();

        this.$scope.existingItems = this.refreshExistingItems();
    }

    public open(callerContext: S) {
        $(this.context.modalElementId).modal();

        this.onOpenWindow();

        this.$scope.callerContext = this.didReceiveCallerContext(callerContext);

        this.$scope.existingItems = this.refreshExistingItems();

        // Forces $scope.selectedItem to update if applicable.
        this.onNameChanged(this.$scope.name);
    }

    protected abstract createObject(name: string): T;

    protected existingItemIsMatchForValue(item: T, value: string) {
        return item.name === value;
    }

    protected nameForExistingItem(item: T) {
        return item.name;
    }

    protected refreshExistingItems(): T[] {
        return [];
    }

    protected didOpenWindow(): void {

    }

    protected didReceiveCallerContext(context: any): S {
        return context;
    }

    protected didCreateItem(item: T): boolean {
        return true;
    }

    protected didSelectItem(item: T): boolean {
        return true;
    }

    protected didReferenceExistingItem(oldItem: T, newItem: T) {
    }

    protected get callerContext(): S {
        return this.$scope.callerContext;
    }

    private onOpenWindow(): void {
        this.$scope.name = "";
        this.$scope.existingItems = [];
        this.$scope.selectedItem = null;
        this.$scope.actionText = "Create";
        this.$scope.actionMode = ESelectOrCreateMode.Select;
        this.$scope.errorMessage = "";
        this.$scope.selectedItem = null;

        this.didOpenWindow();
    }

    private onCloseDialog() {
        let element = $(this.context.modalElementId) as JQuery;
        element.modal("hide");
    }

    private onNameChanged(name: string) {
        // Reset any previous error (e.g., duplicate name) after further modification.
        this.$scope.errorMessage = "";

        let previousItem = this.$scope.selectedItem;

        let matches = this.$scope.existingItems.filter(obj => this.existingItemIsMatchForValue(obj, name));

        let match = matches.length > 0 ? matches[0] : null;

        if (match) {
            this.$scope.actionText = "Select";
            this.$scope.actionMode = ESelectOrCreateMode.Select;
            this.$scope.selectedItem = match;
            this.didReferenceExistingItem(previousItem, match);
        } else {
            this.$scope.actionText = "Create";
            this.$scope.actionMode = ESelectOrCreateMode.Create;
            this.didReferenceExistingItem(previousItem, null);
        }
    }

    private onReferenceExistingItem(item: T): void {
        this.$scope.name = this.nameForExistingItem(item);
    }

    private onCreateOrSelectItemClicked(): void {
        if (this.isExistingItem()) {
            this.performItemSelection();
        } else {
            this.performItemCreation();
        }
    }

    private isExistingItem(): boolean {
        return this.$scope.selectedItem && this.existingItemIsMatchForValue(this.$scope.selectedItem, this.$scope.name);
    }

    private performItemSelection() {
        if (this.didSelectItem(this.$scope.selectedItem)) {
            this.fireEvent(this.context.itemSelectedEventName, this.$scope.selectedItem);
            this.onCloseDialog();
        }
    }

    private performItemCreation() {
        let objectData = this.createObject(this.$scope.name);

        if (objectData === null) {
            this.$scope.errorMessage = "Could not create a new item to submit to the server.";
            return;
        }

        this.service.createItem(objectData).then(item => {
            this.$scope.$apply(() => {
                if (this.onCreateItem(item)) {
                    this.onCloseDialog();
                }
            });
        }).catch(response => {
            this.$scope.$apply(() => {
                if (response && response.data && response.data.message) {
                    this.$scope.errorMessage = response.data.message;
                } else {
                    this.$scope.errorMessage = "An unknown error occurred creating the item.";
                }
            });
        });
    }

    private onCreateItem(item: T): boolean {
        this.fireEvent(this.context.itemCreatedEventName, item);
        return this.didCreateItem(item);
    }

    private fireEvent(eventName: string, item: T) {
        if (eventName && item) {
            let eventData = {callerContext: this.callerContext, item: item};
            this.$scope.$emit(eventName, eventData);
        }
    }
}
