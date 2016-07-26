interface IEditInjectionsScope extends IAppScope {
    sample: ISample;
    injectionsForSample: Array<IInjection>;

    brainAreaNavigation: Array<BrainAreaDepthEntry>;

    injectionVirusName: string;
    fluorophoreName: string;

    canAddInjection: boolean;

    setInjectionVirusName(virus: IVirus);
    setFluorophoreName(fluorophore: IFluorophore);

    formatInjectionVirus(injectionVirusId: string);
    formatFluorophore(fluorophoreId: string);
    formatBrainArea(brainAreaId: string);

    updateLocation(depth: number, index: number);

    addInjection();
}

class EditInjectionsController {
    public static $inject = [
        "$scope"
    ];

    constructor(protected $scope: IEditInjectionsScope) {
        $scope.sample = null;

        $scope.injectionVirusName = '';
        $scope.fluorophoreName = '';

        $scope.injectionsForSample = [];

        $scope.brainAreaNavigation = [];

        $scope.canAddInjection = false;

        $scope.setInjectionVirusName = (virus: IVirus) => {
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

        $scope.addInjection = () => this.addInjection();

        $scope.updateLocation = (depth: number, index: number) => {
            if (this.$scope.brainAreaNavigation.length > depth) {
                if (this.$scope.brainAreaNavigation[depth].selectedAreaIndex != index) {
                    this.$scope.brainAreaNavigation.splice(depth + 1);
                    this.$scope.brainAreaNavigation[depth].selectedAreaIndex = index;
                    this.moveToNextDepthForParent(depth + 1, this.$scope.brainAreaNavigation[depth].areas[this.$scope.brainAreaNavigation[depth].selectedAreaIndex].structureId);
                }
            }
        };

        $('#editInjectionsModal').on('show.bs.modal', (event) => {
            let a = $(event.relatedTarget);
            this.$scope.$apply(() => {
                // Related target does not send the actual object from the service.
                let clone: ISample = a.data('sample');
                this.$scope.sampleService.find(clone.id).then((item: ISample) => {
                    this.setSample(item);
                    this.resetBrainAreaPath();
                });
            });
        });

        this.$scope.$watch("injectionVirusName", () => this.updateCanAddInjection());
        this.$scope.$watch("fluorophoreName", () => this.updateCanAddInjection());
    }

    private setSample(sample: ISample) {
        this.$scope.sample = sample;

        if (sample === null) {
            this.$scope.injectionsForSample = [];
        } else {
            this.$scope.sampleService.injectionsForSample(sample.id).then((data) => {
                this.$scope.injectionsForSample = data;
            }).catch((err) => {
                console.log(err);
                this.$scope.injectionsForSample = [];
            });
        }

        if (this.$scope.virusService.viruses.length > 0) {
            this.$scope.injectionVirusName = this.$scope.virusService.viruses[0].name;
            this.updateCanAddInjection();
        }

        if (this.$scope.fluorophoreService.fluorophores.length > 0) {
            this.$scope.fluorophoreName = this.$scope.fluorophoreService.fluorophores[0].name;
            this.updateCanAddInjection();
        }
    }

    public getSample(): ISample {
        return this.$scope.sample;
    }

    private formatInjectionVirus(injectionVirusId: string) {
        if (injectionVirusId !== null && injectionVirusId.length > 0) {
            return this.$scope.virusService.getDisplayNameForId(injectionVirusId);
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

    private resetBrainAreaPath() {
        this.$scope.brainAreaNavigation = [];
        this.moveToNextDepth(0);
    }

    private moveToNextDepthForParent(depth: number, parentId: number) {
        this.$scope.brainAreaService.brainAreasForParent(parentId).then((data) => {
            this.$scope.$apply(() => {
                if (data !== null && data.length > 0) {
                    this.$scope.brainAreaNavigation[depth] = new BrainAreaDepthEntry();
                    this.$scope.brainAreaNavigation[depth].depth = depth;
                    this.$scope.brainAreaNavigation[depth].areas = data;

                    this.$scope.brainAreaNavigation[depth].selectedAreaIndex = 0;
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
                    this.$scope.brainAreaNavigation[depth] = new BrainAreaDepthEntry();
                    this.$scope.brainAreaNavigation[depth].depth = depth;
                    this.$scope.brainAreaNavigation[depth].areas = data;

                    this.$scope.brainAreaNavigation[depth].selectedAreaIndex = 0;
                    this.moveToNextDepthForParent(depth + 1, data[0].structureId);
                }
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
            this.$scope.injectionsForSample.push(injection);
            this.$scope.sample.injections.push(injection.id);
            this.$scope.$emit("injectionAdded", this.$scope.sample, injection);
        }).catch((err) => {
            console.log(err);
        })
    }

    private updateCanAddInjection() {
        this.$scope.canAddInjection = this.$scope.injectionVirusName.length > 0 && this.$scope.fluorophoreName.length > 0
    }

    private createOrGetVirus(name: string): Promise<IVirus> {
        return new Promise<IVirus>((resolve, reject) => {
            let virus = this.$scope.virusService.findWithName(name);

            if (virus !== null) {
                resolve(virus);
            } else {
                this.$scope.virusService.createItem({name: name}).then((virus) => {
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
            let areaEntry: BrainAreaDepthEntry = this.$scope.brainAreaNavigation[this.$scope.brainAreaNavigation.length - 1];
            let area: IBrainArea = areaEntry.areas[areaEntry.selectedAreaIndex];
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
