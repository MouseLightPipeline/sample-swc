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

    private noBrainAreaSelection;
    private _pauseBrainAreaResets = false;

    constructor(private $scope: ICreateNeuronScope, private $http: any, private $resource: any) {

        this.noBrainAreaSelection = {
            id: "",
            name: "(any subregion)",
            structureId: -1,
            depth: -1,
            parentStructureId: -1,
            structureIdPath: "",
            safeName: "",
            acronym: "'"
        };

        this.$scope.model = {};
        this.$scope.model.idNumber = "";
        this.$scope.model.tag = "";
        this.$scope.model.keywords = "";
        this.$scope.model.injectionId = "";
        this.$scope.model.somaLocation = "";

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

        this.$scope.$watchCollection("injectionsForSample", (newValues) => this.onInjectionsChanged());

        this.$scope.$watch("sampleId", (newValue, oldValue) => this.onSampleIdChanged(newValue, oldValue));

        this.$scope.$watch("model.injectionId", (newValue, oldValue) => this.onInjectionIdChanged(newValue, oldValue));

        this.$scope.model.x = "0";
        this.$scope.model.y = "0";
        this.$scope.model.z = "0";

        this.$scope.updateLocation = (depth: number, index: number) => {
            if (this.$scope.brainAreaNavigationNeuron.length > depth) {
                if (this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex != index) {
                    this.$scope.brainAreaNavigationNeuron.splice(depth + 1);
                    this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex = index;
                    if (depth < 2 || index > 0) {
                        this.moveToNextDepthForParent(depth + 1, this.$scope.brainAreaNavigationNeuron[depth].areas[this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex].structureId, []);
                    }
                }
            }
        };

        this.$scope.$watch("brainAreaService.resourcesAreAvailable", () => {
            if (this.$scope.brainAreaService.resourcesAreAvailable && !this.$scope.initialBrainAreaReset) {
                this.$scope.initialBrainAreaReset = true;
                this.resetBrainAreaPath(null);
            }
        });

        if (this.$scope.brainAreaService.resourcesAreAvailable && !this.$scope.initialBrainAreaReset) {
            this.$scope.initialBrainAreaReset = true;
            this.resetBrainAreaPath(null);
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
        this._pauseBrainAreaResets = false;
        if (this.$scope.model.injectionId === "") {
            if (this.$scope.injectionsForSample.length > 0) {
                this.$scope.model.injectionId = this.$scope.injectionsForSample[0].id;
            } else {
                this.onInjectionIdChanged("", "forceChange")
            }
        }
    }

    private onSampleIdChanged(newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }

        this.$scope.injectionsForSample = [];

        this.$scope.model.injectionId = "";

        if (this.$scope.sampleId.length > 0) {
            this._pauseBrainAreaResets = true;
            this.$scope.injectionsForSample = this.$scope.injectionService.injectionsForSample(this.$scope.sampleId);
        }
    }

    private onInjectionIdChanged(newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }

        let injection = this.$scope.injectionService.find(this.$scope.model.injectionId);

        if (!this.$scope.brainAreaService.resourcesAreAvailable) {
            setTimeout(() => this.onInjectionIdChanged(newValue, oldValue), 250)
        } else if (injection) {
            let brainArea = this.$scope.brainAreaService.find(injection.brainAreaId);

            let parts = brainArea.structureIdPath.split("/");

            let partIds = parts.filter(obj => obj.length > 0).map(obj => parseInt(obj));

            if (!this._pauseBrainAreaResets)
                this.resetBrainAreaPath(partIds);
        } else {
            if (!this._pauseBrainAreaResets)
                this.resetBrainAreaPath([]);
        }
    }

    private createNeuron() {
        this.$scope.lastCreateMessage = "";
        this.$scope.lastCreateError = "";

        let index = this.$scope.brainAreaNavigationNeuron.length - 1;
        let area: IBrainArea = null;

        while (area === null && index > 0) {
            let areaEntry: BrainAreaDepthEntry = this.$scope.brainAreaNavigationNeuron[index];
            area = areaEntry.areas[areaEntry.selectedAreaIndex];

            if (area.depth < 0) {
                area = null;
                index--;
            }
        }

        let location = this.$scope.model.somaLocation;
        if (location.length > 2 && location[0] === "(" && location[location.length - 1] === ")") {
            location = location.slice(1, location.length - 1).trim();
        }
        console.log(location);
        let parts = location.split(",");

        let x = 0;
        let y = 0;
        let z = 0;

        if (parts.length === 3) {
            x = parseFloat(parts[0].trim());
            if (isNaN(x)) {
                this.$scope.lastCreateError = "Could not parse soma x location.";
                return;
            }

            y = parseFloat(parts[1].trim());
            if (isNaN(y)) {
                this.$scope.lastCreateError = "Could not parse soma y location.";
                return;
            }

            z = parseFloat(parts[2].trim());
            if (isNaN(z)) {
                this.$scope.lastCreateError = "Could not parse soma z location.";
                return;
            }
        } else {
            this.$scope.lastCreateError = "Could not parse soma location.";
            return;
        }

        let item = {
            idNumber: parseInt(this.$scope.model.idNumber),
            tag: this.$scope.model.tag,
            keywords: this.$scope.model.keywords,
            injectionId: this.$scope.model.injectionId,
            brainAreaId: area.id,
            x: x,
            y: y,
            z: z
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

    private resetBrainAreaPath(stack: number[]) {
        this.$scope.brainAreaNavigationNeuron = [];
        this.moveToNextDepth(1, stack);
    }

    private onBrainAreasForDepth(depth: number, data, stack: number[]) {
        let nextIndex = 0;

        if (data !== null && data.length > 0) {
            if (depth > 1) {
                data.splice(0, 0, this.noBrainAreaSelection);
                nextIndex = 1;
            }

            if (depth > 0 && stack != null) {
                if (stack.length > depth) {
                    let matchedIndex = data.map((obj, index) => obj.structureId === stack[depth] ? index : -1).filter(obj => obj >= 0);

                    if (matchedIndex.length === 1) {
                        nextIndex = matchedIndex[0];
                    }
                } else if (stack.length === 0) {
                    nextIndex = (depth > 1) ? 1 : 0;
                } else {
                    nextIndex = 0;
                }
            }

            this.$scope.brainAreaNavigationNeuron[depth] = new BrainAreaDepthEntry();
            this.$scope.brainAreaNavigationNeuron[depth].depth = depth;
            this.$scope.brainAreaNavigationNeuron[depth].areas = data;
            this.$scope.brainAreaNavigationNeuron[depth].selectedAreaIndex = nextIndex;
            this.moveToNextDepthForParent(depth + 1, data[nextIndex].structureId, stack);
        }
    }

    private moveToNextDepthForParent(depth: number, parentId: number, stack: number[]) {
        this.$scope.brainAreaService.brainAreasForParent(parentId).then((data) => {
            this.$scope.$apply(() => {
                this.onBrainAreasForDepth(depth, data, stack);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    private moveToNextDepth(depth: number, stack: number[]) {
        this.$scope.brainAreaService.brainAreasForDepth(depth).then((data) => {
            this.$scope.$apply(() => {
                this.onBrainAreasForDepth(depth, data, stack);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}

angular.module("sampleManager").controller("createNeuronController", CreateNeuronController);
