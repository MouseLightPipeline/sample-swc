interface IEditNeuronScope extends IAppScope {
    title: string;
    neuron: INeuron;

    idString: string;
    tag: string;
    keywords: string;
    somaLocation: string;

    updateNeuron(): void;
    isValidSomaLocation(): boolean;
}

class EditNeuronController implements IModalController<INeuron> {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    private static _modalElementId = "#editNeuronModal";

    private _dialogElement: JQuery;

    constructor(private $scope: IEditNeuronScope, private modalService: ModalService) {
        this.modalService.registerEditNeuronController(this);

        this.$scope.updateNeuron = () => this.updateNeuron();

        this.$scope.isValidSomaLocation = () => this.isValidSomaLocation();

        this._dialogElement = $(EditNeuronController._modalElementId) as JQuery;
    }

    public open(neuron: INeuron) {
        this._dialogElement.modal();

        this.$scope.neuron = neuron;
        this.$scope.title = `Neuron ${this.$scope.neuronService.getDisplayName(neuron)}`;

        this.$scope.idString = neuron.idString;
        this.$scope.tag = neuron.tag;
        this.$scope.keywords = neuron.keywords;
        this.$scope.somaLocation = `${neuron.x}, ${neuron.y}, ${neuron.z}`;
    }

    private isValidSomaLocation(): boolean {
        try {
            parseSomaLocation(this.$scope.somaLocation);
        } catch (err) {
            return false;
        }

        return true;
    }

    private updateNeuron(): void {
        let somaLocation: ISomaLocation;

        try {
            somaLocation = parseSomaLocation(this.$scope.somaLocation);
        } catch (err) {
            return;
        }

        this.$scope.neuron.idString = this.$scope.idString;

        this.$scope.neuron.tag = this.$scope.tag;

        this.$scope.neuron.keywords = this.$scope.keywords;

        this.$scope.neuron.x = somaLocation.x;
        this.$scope.neuron.y = somaLocation.y;
        this.$scope.neuron.z = somaLocation.z;

        this.$scope.neuronService.update(this.$scope.neuron);

        this._dialogElement.modal("hide");
    }
}

angular.module("sampleManager").controller("editNeuronController", EditNeuronController);
