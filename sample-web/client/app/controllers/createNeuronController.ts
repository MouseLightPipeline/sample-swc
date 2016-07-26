/// <reference path="../../../../shared/client/services/neuronService.ts"/>
/// <reference path="../helpers/validation.ts"/>

interface ICreateNeuronScope extends IAppScope {
    model: any;
    isValidIdNumber: boolean;
    lastCreateMessage: string;
    lastCreateError: string;
    injectionsForSample: any;
    brainAreaNavigationNeuron: Array<BrainAreaDepthEntry>;
    initialBrainAreaReset: boolean;
    sampleId: string;

    isValidDouble(val: string);
    createNeuron();
    canCreateNeuron(): boolean;
    formatInjection(s);
    updateLocation(depth: number, index: number);
}

class CreateNeuronController {
    public static $inject = [
        "$scope",
        "$http",
        "$resource"
    ];

    constructor(private $scope: ICreateNeuronScope, private $http: any, private $resource: any) {
        this.$scope.model = {};
        this.$scope.model.idNumber = "";
        this.$scope.model.tag = "";
        this.$scope.model.injectionId = "";
        this.$scope.sampleId = "";

        this.$scope.isValidIdNumber = false;

        this.$scope.lastCreateMessage = "";
        this.$scope.lastCreateError = "";

        this.$scope.injectionsForSample = [];

        this.$scope.brainAreaNavigationNeuron = [];

        this.$scope.initialBrainAreaReset = false;

        this.$scope.$watch("model.idNumber", (newValue: string) => {
            this.$scope.isValidIdNumber = isValidIdNumberValue(newValue);
        });

        this.$scope.isValidDouble = (val: string) => isValidDouble(val);

        this.$scope.createNeuron = () => this.createNeuron();

        this.$scope.canCreateNeuron = (): boolean => this.isValidNeuronEntry();

        this.$scope.formatInjection = (s) => {
            return "Foo"
        };

        this.$scope.$watchCollection("neuronService.neurons", (newValues) => this.onNeuronCollectionChanged());

        this.$scope.$watchCollection("sampleService.samples", (newValues) => this.onSampleCollectionChanged());

        this.$scope.$watchCollection("injectionService.injections", (newValues) => this.onInjectionsChanged());

        this.$scope.$watch("sampleId", (newValue, oldValue) => this.onSampleIdChanged(newValue, oldValue));

        this.$scope.model.x = "0";
        this.$scope.model.y = "0";
        this.$scope.model.z = "0";

        this.$scope.updateLocation = (depth: number, index: number) => {
            if (this.$scope.brainAreaNavigationNeuron.length > depth) {
                if (this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex != index) {
                    this.$scope.brainAreaNavigationNeuron.splice(depth + 1);
                    this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex = index;
                    this.moveToNextDepthForParent(depth + 1, this.$scope.brainAreaNavigationNeuron[depth].areas[this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex].structureId);
                }
            }
        };

        this.$scope.$watch("brainAreaService.resourcesAreAvailable", () => {
            if (this.$scope.brainAreaService.resourcesAreAvailable && !this.$scope.initialBrainAreaReset) {
                this.$scope.initialBrainAreaReset = true;
                this.resetBrainAreaPath();
            }
        });

        if (this.$scope.brainAreaService.resourcesAreAvailable && !this.$scope.initialBrainAreaReset) {
            this.$scope.initialBrainAreaReset = true;
            this.resetBrainAreaPath();
        }

        this.onSampleCollectionChanged();
    }

    private isValidNeuronEntry(): boolean {
        return this.$scope.isValidIdNumber && this.haveValidSample() && this.haveValidSomaLocation() && (this.$scope.model.injectionId.length > 0);
    }

    private haveValidSomaLocation() {
        return isValidDouble(this.$scope.model.x) && isValidDouble(this.$scope.model.y) && isValidDouble(this.$scope.model.z);
    }

    private haveValidSample(): boolean {
        return this.$scope.sampleId.length > 0;
    }

    private onNeuronCollectionChanged() {
        var nextValue: number = 1;

        while (this.$scope.neuronService.findWithIdNumber(nextValue) !== null) {
            nextValue++;
        }

        this.$scope.model.idNumber = nextValue.toString();
    }

    private onSampleCollectionChanged() {
        if ((this.$scope.sampleId.length == 0) && (this.$scope.sampleService.samples.length > 0)) {
            this.$scope.sampleId = this.$scope.sampleService.samples.slice(-1).pop().id;
        }
    }

    private onInjectionsChanged() {
        //if ((this.$scope.sampleId.length == 0) && (this.$scope.sampleService.samples.length > 0)) {
        //     this.$scope.sampleId = this.$scope.sampleService.samples.slice(-1).pop().id;
        // }
    }

    private onSampleIdChanged(newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }

        this.$scope.injectionsForSample = [];

        if (this.$scope.sampleId.length > 0) {
            this.$scope.injectionService.injectionsForSample(this.$scope.sampleId).then((data) => {
                this.$scope.$apply(() => {
                    this.$scope.injectionsForSample = data;

                    if (data.length > 0) {
                        this.$scope.model.injectionId = data[0].id;
                    }
                });
            });
        }
    }

    private createNeuron() {
        this.$scope.lastCreateMessage = "";
        this.$scope.lastCreateError = "";

        let areaEntry: BrainAreaDepthEntry = this.$scope.brainAreaNavigationNeuron[this.$scope.brainAreaNavigationNeuron.length - 1];
        let area: IBrainArea = areaEntry.areas[areaEntry.selectedAreaIndex];

        let item = {
            idNumber: parseInt(this.$scope.model.idNumber),
            tag: this.$scope.model.tag,
            injectionId: this.$scope.model.injectionId,
            brainAreaId: area.id,
            x: parseFloat(this.$scope.model.x),
            y: parseFloat(this.$scope.model.y),
            z: parseFloat(this.$scope.model.z)
        };

        this.$scope.neuronService.createItem(item).then((neuron) => {
            this.$scope.$apply(() => {
                this.$scope.lastCreateMessage = "Created neuron with id number " + neuron.idNumber;
            });
            setTimeout(() => {
                this.$scope.$apply(() => {
                    this.$scope.lastCreateMessage = "";
                });
            }, 4000);
        }).catch((error) => {
            this.$scope.$apply(() => {
                if (error.data != null)
                    this.$scope.lastCreateError = error.data.message;
                else
                    this.$scope.lastCreateError = "An unknown error occurred connecting to the server.";
            });
        });
    }

    private resetBrainAreaPath() {
        this.$scope.brainAreaNavigationNeuron = [];
        this.moveToNextDepth(0);
    }

    private moveToNextDepthForParent(depth: number, parentId: number) {
        this.$scope.brainAreaService.brainAreasForParent(parentId).then((data) => {
            this.$scope.$apply(() => {
                if (data !== null && data.length > 0) {
                    this.$scope.brainAreaNavigationNeuron[depth] = new BrainAreaDepthEntry();
                    this.$scope.brainAreaNavigationNeuron[depth].depth = depth;
                    this.$scope.brainAreaNavigationNeuron[depth].areas = data;

                    this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex = 0;
                    this.moveToNextDepthForParent(depth + 1, data[0].structureId);
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    private moveToNextDepth(depth: number) {
        this.$scope.brainAreaService.brainAreasForDepth(depth).then((data) => {
            this.$scope.$apply(() => {
                if (data !== null && data.length > 0) {
                    this.$scope.brainAreaNavigationNeuron[depth] = new BrainAreaDepthEntry();
                    this.$scope.brainAreaNavigationNeuron[depth].depth = depth;
                    this.$scope.brainAreaNavigationNeuron[depth].areas = data;

                    this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex = 0;
                    this.moveToNextDepthForParent(depth + 1, data[0].structureId);
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}

angular.module("sampleManager").controller("createNeuronController", CreateNeuronController);
