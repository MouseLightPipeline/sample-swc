import IToastrService = angular.toastr.IToastrService;

class SelectMouseStrainController extends SelectItemController<IMouseStrain, ISelectMouseStrainControllerContext> implements IModalController<ISelectMouseStrainControllerContext> {
    public static $inject = [
        "$scope",
        "toastr",
        "modalService"
    ];

    constructor(protected $scope: any, protected toaster: IToastrService, private modalService: ModalService) {
        super($scope, $scope.mouseStrainService, {
            modalElementId: "#selectMouseStrainModal",
            itemCreatedEventName: "mouseStrainCreatedEvent",
            itemSelectedEventName: "mouseStrainSelectedEvent"
        });

        this.$scope.title = "";

        this.modalService.registerSelectMouseStrainController(this);
    }

    protected didReceiveCallerContext(callerContext: ISelectMouseStrainControllerContext): ISelectMouseStrainControllerContext {
        this.$scope.name = callerContext.name;

        if (callerContext.sample == null) {
            this.$scope.title = "Mouse Strain for New Sample";
        } else {
            this.$scope.title = `Mouse Strain for Sample ${this.$scope.sampleService.getDisplayName(callerContext.sample)}`;
        }

        return callerContext;
    }

    protected didCreateItem(item: IMouseStrain): boolean {
        this.toaster.success("Create strain <i>" + item.name + "</i>", "Success");

        return this.updateSample(item);
    }

    protected didSelectItem(item: IMouseStrain): boolean {
        return this.updateSample(item);
    }

    protected createObject(name: string): IMouseStrain {
        return {
            name: name
        };
    }

    protected refreshExistingItems(): IMouseStrain[] {
        return this.$scope.mouseStrainService.mouseStrains;
    }

    private updateSample(item: IMouseStrain): boolean {
        if (this.callerContext && this.callerContext.sample) {
            if (this.callerContext.sample.mouseStrainId !== item.id) {
                this.callerContext.sample.mouseStrainId = item.id;

                this.$scope.sampleService.update(this.callerContext.sample);
            }
        }

        return true;
    }
}

angular.module("sampleManager").controller("createMouseStrainController", SelectMouseStrainController);
