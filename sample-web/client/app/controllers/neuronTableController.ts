class NeuronTableController {
    public static $inject = [
        "$scope",
        "modalService"
    ];

    constructor(private $scope: any, private modalService: ModalService) {
        this.$scope.formatSample = (sampleId) => {
            return this.formatSample(sampleId);
        };

        this.$scope.formatBrainArea = (neuron: INeuron) => {
            return this.formatBrainArea(neuron);
        };

        this.$scope.inspectNeuron = (neuron: INeuron) => {
            this.modalService.openInspectNeuronController(neuron);
        };

        this.$scope.editNeuron = (neuron: INeuron) => {
            this.modalService.openEditNeuronController(neuron);
        };
    }

    private formatSample(neuron: INeuron): string {
        let injection: IInjection = this.$scope.injectionService.find(neuron.injectionId);

        if (injection === null) {
            return "(unknown)";
        }

        return this.$scope.sampleService.getDisplayNameForId(injection.sampleId);
    }

    private formatBrainArea(neuron: INeuron): string {
        let location = "(not defined)";

        if (neuron.brainAreaId !== null) {
            location = this.$scope.brainAreaService.getDisplayNameForId(neuron.brainAreaId);
        } else {
            let injection: IInjection = this.$scope.injectionService.find(neuron.injectionId);

            if (injection) {
                location = this.$scope.brainAreaService.getDisplayNameForId(injection.brainAreaId);
            }
        }

        return location;
    }
}

angular.module("sampleManager").controller("neuronTableController", NeuronTableController);
