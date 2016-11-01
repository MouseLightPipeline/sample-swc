interface IInspectNeuronScope extends IAppScope {
    title: string;
    neuron: INeuron;

    formatPossibleEmpty(str: string): string;
    formatSample(sample: INeuron): string;
    formatBrainArea(sample: INeuron): string;
    formatInjection(sample: INeuron): string;
    formatSomaLocation(sample: INeuron): string;
    formatTimestampDate(date: string): string;
}

class InspectNeuronController implements IModalController<INeuron> {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    constructor(private $scope: IInspectNeuronScope, private modalService: ModalService) {
        this.modalService.registerInspectNeuronController(this);

        this.$scope.formatPossibleEmpty = str => str || "(none)";
        this.$scope.formatSample = neuron => this.formatSample(neuron);
        this.$scope.formatBrainArea = neuron => this.formatBrainArea(neuron);
        this.$scope.formatInjection = neuron => this.formatInjection(neuron);
        this.$scope.formatSomaLocation = neuron => InspectNeuronController.formatSomaLocation(neuron);
        this.$scope.formatTimestampDate = date => moment(date).format("YYYY-MM-DD hh:mm:ss.SSS");
    }

    public open(neuron: INeuron) {
        $("#inspectNeuronModal").modal();

        this.$scope.neuron = neuron;
        this.$scope.title = `Neuron ${this.$scope.neuronService.getDisplayName(neuron)}`;
    }

    private formatSample(neuron: INeuron): string {
        if (!neuron) {
            return "(none)"
        }

        let injection: IInjection = this.$scope.injectionService.find(neuron.injectionId);

        if (!injection) {
            return "(none)";
        }

        return this.$scope.sampleService.getDisplayNameForId(injection.sampleId);
    }

    private formatBrainArea(neuron: INeuron): string {
        let brainArea = "(none)";

        if (!neuron) {
            return brainArea;
        }

        if (neuron.brainAreaId == null) {
            let injection: IInjection = this.$scope.injectionService.find(neuron.injectionId);

            if (injection) {
                brainArea = this.$scope.brainAreaService.getDisplayNameForId(injection.brainAreaId) + " (inherited)";
            }
        } else {
            brainArea = this.$scope.brainAreaService.getDisplayNameForId(neuron.brainAreaId, "(none)");
        }

        return brainArea;
    }

    private formatInjection(neuron: INeuron): string {
        return neuron ? this.$scope.injectionService.getDisplayNameForId(neuron.injectionId, "(none)") : "(none)";
    }

    private static formatSomaLocation(neuron: INeuron): string {
        return neuron ? `(${neuron.x}, ${neuron.y}, ${neuron.z})` : "(undefined)";
    }
}

angular.module("sampleManager").controller("inspectNeuronController", InspectNeuronController);
