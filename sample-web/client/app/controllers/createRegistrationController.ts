class CreateRegistrationController extends SelectItemController<IRegistrationTransform, ISample> {
    public static $inject = [
        "$scope",
        "toastr",
        "modalService"
    ];

    constructor(protected $scope: any, protected toaster: any, private modalService: ModalService) {
        super($scope, $scope.transformService, {
            modalElementId: "#createRegistrationModal",
            itemCreatedEventName: "registrationCreatedEvent",
            itemSelectedEventName: "registrationSelectedEvent"
        });

        this.modalService.registerRegistrationTransformController(this);

        this.$scope.isCreateEnabled = () => this.$scope.actionMode === ESelectOrCreateMode.Create;
    }

    protected didReceiveCallerContext(callerContext: ISample): ISample {
        if (callerContext == null) {
            this.$scope.title = "Registration Transform for New Sample";
        } else {
            this.$scope.title = `Registration Transform for Sample ${this.$scope.sampleService.getDisplayName(callerContext)}`;
            let transform: IRegistrationTransform = this.$scope.transformService.find(callerContext.activeRegistrationTransformId);

            if (transform) {
                this.$scope.name = transform.location;
                this.updateScopeItem(transform);
            }
        }

        return callerContext;
    }

    protected didCreateItem(item: IRegistrationTransform): boolean {
        this.toaster.success("Create transform <i>" + item.name + "</i>", "Success");

        return this.updateSample(item);
    }

    protected didSelectItem(item: IRegistrationTransform): boolean {
        return this.updateSample(item);
    }

    protected didReferenceExistingItem(oldItem: IRegistrationTransform, newItem: IRegistrationTransform) {
        if (newItem === null) {
            if (oldItem !== null) {
                // We're going from an existing item back to a new item.  Bring back the data.
                this.updateScopeItem(this.$scope.editingItem);
            }
        } else {
            if (oldItem !== null) {
                // We're going from a new item to an existing - store the info in case it was a mistake or they go back.
                this.$scope.editingItem.name = this.$scope.item.name;
                this.$scope.editingItem.notes = this.$scope.item.notes;
            } // Otherwise ignore if just switching between existing.

            this.updateScopeItem(newItem);
        }
    }

    protected didOpenWindow(): void {
        this.$scope.item = {};
        this.$scope.item.name = "";
        this.$scope.item.notes = "";

        this.$scope.editingItem = {};
        this.$scope.editingItem.name = "";
        this.$scope.editingItem.notes = "";
    }

    protected createObject(): any {
        return this.$scope.callerContext ? {
            name: this.$scope.item.name,
            location: this.$scope.name,
            notes: this.$scope.item.notes,
            sampleId: this.$scope.callerContext.id
        } : null;
    }

    protected nameForExistingItem(item: IRegistrationTransform) {
        return item.location;
    }

    protected existingItemIsMatchForValue(item: IRegistrationTransform, value: string) {
        return item.location === value;
    }

    protected refreshExistingItems(): IRegistrationTransform[] {
        return this.callerContext ? this.$scope.transformService.registrationTransformsForSample(this.callerContext.id) : [];
    }

    private updateScopeItem(obj: IRegistrationTransform) {
        this.$scope.item.name = obj.name;
        this.$scope.item.notes = obj.notes;
    }

    private updateSample(item: IRegistrationTransform): boolean {
        if (this.callerContext) {
            if (this.callerContext.activeRegistrationTransformId !== item.id) {
                this.callerContext.activeRegistrationTransformId = item.id;

                this.$scope.sampleService.update(this.callerContext);
            }
        }

        return true;
    }
}

angular.module("sampleManager").controller("createRegistrationController", CreateRegistrationController);
