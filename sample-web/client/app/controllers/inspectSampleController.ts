interface IInspectSampleScope extends IAppScope {
    title: string;
    sample: ISample
}

class InspectSampleController implements IModalController<ISample> {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    constructor(private $scope: IInspectSampleScope, private modalService: ModalService) {
        this.modalService.registerInspectSampleController(this);
    }

    public open(sample: ISample) {
        $("#inspectSampleModal").modal();

        this.$scope.sample = sample;
        this.$scope.title = `Sample ${this.$scope.sampleService.getDisplayName(sample)}`;
    }
}

angular.module("sampleManager").controller("inspectSampleController", InspectSampleController);
