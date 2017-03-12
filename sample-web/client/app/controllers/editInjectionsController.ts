interface IEditInjectionsScope extends IAppScope {
    title: string;

    sample: ISample;
    injectionsForSample: Array<IInjection>;

    brainAreaNavigation: Array<BrainAreaDepthEntry>;

    injectionVirusName: string;
    fluorophoreName: string;

    canAddInjection: boolean;

    searchableBrainAreas: any

    setInjectionVirusName(virus: IInjectionVirus);
    setFluorophoreName(fluorophore: IFluorophore);

    formatInjectionVirus(injectionVirusId: string);
    formatFluorophore(fluorophoreId: string);
    formatBrainArea(brainAreaId: string);
    formatSample(sample: ISample);
    updateLocation(depth: number, index: number);

    addInjection();

    onSelectedArea(sel: any);
}

class EditInjectionsController {
    public static $inject = [
        "$scope"
    ];

    private noBrainAreaSelection;

    constructor(protected $scope: IEditInjectionsScope) {
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

        this.$scope.searchableBrainAreas = [];
        this.$scope.onSelectedArea = (sel: any) => {
            if (sel) {
                const brainArea: IBrainArea = sel.originalObject;

                if (brainArea) {
                    console.log(brainArea);

                    let parts = brainArea.structureIdPath.split("/");

                    let partIds = parts.filter(obj => obj.length > 0).map(obj => parseInt(obj));

                    this.resetBrainAreaPath(partIds);
                }
            }
        };

        $scope.title = "";

        $scope.sample = null;

        $scope.injectionVirusName = '';
        $scope.fluorophoreName = '';

        $scope.injectionsForSample = [];

        $scope.brainAreaNavigation = [];

        $scope.canAddInjection = false;

        $scope.setInjectionVirusName = (virus: IInjectionVirus) => {
            this.$scope.injectionVirusName = virus.name;
        };

        $scope.setFluorophoreName = (fluorophore: IFluorophore) => {
            this.$scope.fluorophoreName = fluorophore.name;
        };

        this.$scope.formatInjectionVirus = (injectionVirusId: string) => {
            return this.formatInjectionVirus(injectionVirusId);
        };

        this.$scope.formatFluorophore = (fluorophoreId: string) => {
            return this.formatFluorophore(fluorophoreId);
        };

        this.$scope.formatBrainArea = (brainAreaId: string) => {
            return this.formatBrainArea(brainAreaId);
        };

        this.$scope.formatSample = (sample: ISample) => {
            return this.$scope.sampleService.getDisplayName(sample);
        };

        $scope.addInjection = () => this.addInjection();
/*
        $scope.updateLocation = (depth: number, index: number) => {
            if (this.$scope.brainAreaNavigation.length > depth) {
                if (this.$scope.brainAreaNavigation[depth].selectedAreaIndex != index) {
                    this.$scope.brainAreaNavigation.splice(depth + 1);
                    this.$scope.brainAreaNavigation[depth].selectedAreaIndex = index;
                    if (depth < 2 || index > 0) {
                        this.moveToNextDepthForParent(depth + 1, this.$scope.brainAreaNavigation[depth].areas[this.$scope.brainAreaNavigation[depth].selectedAreaIndex].structureId);
                    }
                }
            }
        };*/

        $('#editInjectionsModal').on('show.bs.modal', (event) => {
            let a = $(event.relatedTarget);
            this.$scope.$apply(() => {
                // Related target does not send the actual object from the service.
                let clone: ISample = a.data('sample');
                let item: ISample = this.$scope.sampleService.find(clone.id);
                this.setSample(item);
                this.resetBrainAreaPath([]);

            });
        });

        this.$scope.$watch("injectionVirusName", () => this.updateCanAddInjection());
        this.$scope.$watch("fluorophoreName", () => this.updateCanAddInjection());
        this.$scope.$watchCollection("brainAreaService.brainAreas", () => {this.$scope.searchableBrainAreas = this.$scope.brainAreaService.brainAreas});
    }

    private setSample(sample: ISample) {
        this.$scope.sample = sample;

        if (sample === null) {
            this.$scope.title = "Injections for New Sample";
            this.$scope.injectionsForSample = [];
        } else {
            this.$scope.injectionsForSample = this.$scope.injectionService.injectionsForSample(sample.id);
            this.$scope.title = `Injections for Sample ${this.$scope.sampleService.getDisplayName(sample)}`;
        }

        if (this.$scope.injectionVirusService.injectionViruses.length > 0) {
            this.$scope.injectionVirusName = this.$scope.injectionVirusService.injectionViruses[0].name;
            this.updateCanAddInjection();
        }

        if (this.$scope.fluorophoreService.fluorophores.length > 0) {
            this.$scope.fluorophoreName = this.$scope.fluorophoreService.fluorophores[0].name;
            this.updateCanAddInjection();
        }
    }

    private formatInjectionVirus(injectionVirusId: string) {
        if (injectionVirusId !== null && injectionVirusId.length > 0) {
            return this.$scope.injectionVirusService.getDisplayNameForId(injectionVirusId);
        } else {
            return "(none)";
        }
    }

    private formatFluorophore(fluorophoreId: string) {
        if (fluorophoreId !== null && fluorophoreId.length > 0) {
            return this.$scope.fluorophoreService.getDisplayNameForId(fluorophoreId);
        } else {
            return "(none)";
        }
    }

    private formatBrainArea(brainAreaId: string) {
        if (brainAreaId !== null && brainAreaId.length > 0) {
            return this.$scope.brainAreaService.getDisplayNameForId(brainAreaId);
        } else {
            return "(none)";
        }
    }

    private resetBrainAreaPath(stack: number[]) {
        this.$scope.brainAreaNavigation = [];
        this.moveToNextDepth(1, stack);
    }

    private onBrainAreasForDepth(depth: number, data: IBrainArea[], stack: number[]) {
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

            this.$scope.brainAreaNavigation[depth] = new BrainAreaDepthEntry();
            this.$scope.brainAreaNavigation[depth].depth = depth;
            this.$scope.brainAreaNavigation[depth].areas = data;
            this.$scope.brainAreaNavigation[depth].selectedAreaIndex = nextIndex;
            this.moveToNextDepthForParent(depth + 1, data[nextIndex].structureId, stack);
        }
    }

    private moveToNextDepthForParent(depth: number, parentId: number, stack: number[]) {
        this.$scope.brainAreaService.brainAreasForParent(parentId).then((data: IBrainArea[]) => {
            this.$scope.$apply(() => {
                this.onBrainAreasForDepth(depth, data, stack);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    private moveToNextDepth(depth: number, stack: number[]) {
        this.$scope.brainAreaService.brainAreasForDepth(depth).then((data: IBrainArea[]) => {
            this.$scope.$apply(() => {
                this.onBrainAreasForDepth(depth, data, stack);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    private addInjection() {
        let virus = null;
        this.createOrGetVirus(this.$scope.injectionVirusName).then((aVirus) => {
            this.$scope.setInjectionVirusName(aVirus);
            virus = aVirus;
            return this.createOrGetFluorophore(this.$scope.fluorophoreName);
        }).then((fluorophore) => {
            this.$scope.setFluorophoreName(fluorophore);
            return this.createInjection(virus, fluorophore);
        }).then((injection) => {
            this.$scope.$emit("injectionAdded", this.$scope.sample, injection);
        }).catch((err) => {
            console.log(err);
        })
    }

    private updateCanAddInjection() {
        this.$scope.canAddInjection = this.$scope.injectionVirusName.length > 0 && this.$scope.fluorophoreName.length > 0
    }

    private createOrGetVirus(name: string): Promise<IInjectionVirus> {
        return new Promise<IInjectionVirus>((resolve, reject) => {
            let virus = this.$scope.injectionVirusService.findWithName(name);

            if (virus !== null) {
                resolve(virus);
            } else {
                this.$scope.injectionVirusService.createItem({name: name}).then((virus) => {
                    resolve(virus);
                }).catch((err) => {
                    reject(err);
                })
            }
        });
    }

    private createOrGetFluorophore(name: string): Promise<IFluorophore> {
        return new Promise<IFluorophore>((resolve, reject) => {
            let fluorophore = this.$scope.fluorophoreService.findWithName(name);

            if (fluorophore !== null) {
                resolve(fluorophore);
            } else {
                this.$scope.fluorophoreService.createItem({name: name}).then((fluorophore) => {
                    resolve(fluorophore);
                }).catch((err) => {
                    reject(err);
                })
            }
        });
    }

    private createInjection(virus, fluorophore) {
        return new Promise<IInjection>((resolve, reject) => {
            let index = this.$scope.brainAreaNavigation.length - 1;
            let area: IBrainArea = null;

            while (area === null && index > 0) {
                let areaEntry: BrainAreaDepthEntry = this.$scope.brainAreaNavigation[index];
                area = areaEntry.areas[areaEntry.selectedAreaIndex];

                if (area.depth < 0) {
                    area = null;
                    index--;
                }
            }

            this.$scope.injectionService.createItem({
                sampleId: this.$scope.sample.id,
                injectionVirusId: virus.id,
                fluorophoreId: fluorophore.id,
                brainAreaId: area.id
            }).then((injection) => {
                this.$scope.$apply(() => {
                    resolve(injection);
                });
            }).catch((err) => {
                reject(err);
            })
        })
    }
}

angular.module("sampleManager").controller("editInjectionsController", EditInjectionsController);
