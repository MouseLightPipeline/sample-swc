interface IEditSampleScope extends IAppScope {
    title: string;
    sample: ISample;

    sampleDate: string;
    animalId: string;
    tag: string;
    comment: string;

    updateSample(): void;
    isValidDate(): boolean;
}

class EditSampleController implements IModalController<ISample> {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    private static  _modalElementId = "#editSampleModal";

    private _dialogElement: JQuery;

    constructor(private $scope: IEditSampleScope, private modalService: ModalService) {
        this.modalService.registerEditSampleController(this);

        this.$scope.updateSample = () => this.updateSample();

        this.$scope.isValidDate = () => isValidDateValue(new Date(this.$scope.sampleDate));

        this._dialogElement = $(EditSampleController._modalElementId) as JQuery;
    }

    public open(sample: ISample) {
        this._dialogElement.modal();

        this.$scope.sample = sample;
        this.$scope.title = `Sample ${this.$scope.sampleService.getDisplayName(sample)}`;

        this.$scope.sampleDate = moment(sample.sampleDate).format("YYYY-MM-DD");
        this.$scope.animalId = sample.animalId;
        this.$scope.tag = sample.tag;
        this.$scope.comment = sample.comment;
    }

    private updateSample() {
        this.$scope.sample.sampleDate = new Date(this.$scope.sampleDate + "T12:00:00Z");
        this.$scope.sample.animalId = this.$scope.animalId;
        this.$scope.sample.tag = this.$scope.tag;
        this.$scope.sample.comment = this.$scope.comment;

        this.$scope.sampleService.update(this.$scope.sample);

        this._dialogElement.modal("hide");
    }
}

angular.module("sampleManager").controller("editSampleController", EditSampleController);
