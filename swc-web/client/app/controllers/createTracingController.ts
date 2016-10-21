class CreateTracingController {
    public static $inject = [
        '$scope',
        '$http'
    ];

    constructor(private $scope: any, private $http: any) {
        this.$scope.theFile = null;
        this.$scope.annotator = '';
        this.$scope.lengthMicrometers = '0';
        this.$scope.neuronId = '';
        this.$scope.injectionId = '';
        this.$scope.sampleId = '';
        this.$scope.structureId = '';
        this.$scope.neuronsForInjection = [];
        this.$scope.injectionsForSample = [];
        this.$scope.isInCreatePost = false;
        this.$scope.lastCreateMessage = '';

        this.$scope.$watch('sampleId', (newValue, oldValue) => {
            if (newValue !== oldValue) this.updateInjections(newValue);
        });

        this.$scope.$watch('injectionId', (newValue, oldValue) => {
            if (newValue !== oldValue) this.updateNeurons(newValue);
        });

        this.$scope.$watch('structureIdentifierService.structures', (newValue, oldValue) => {
            if (newValue !== oldValue) this.updateDefaultTracingStructure();
        });

        this.$scope.send = () => {
            this.send()
        };

        this.updateDefaultTracingStructure();

        this.$scope.canCreateTracing = (): boolean => this.isValidTracingEntry();
    }

    private isValidTracingEntry(): boolean {
        return this.haveValidSample() && this.haveValidNeuron() && this.isValidAnnotator() && this.isValidFile() && this.isValidLength(this.$scope.lengthMicrometers);
    }

    private haveValidSample(): boolean {
        return this.$scope.sampleId.length > 0;
    }

    private haveValidNeuron(): boolean {
        return this.$scope.neuronId.length > 0;
    }

    private isValidLength(val: string): boolean {
        return (val.length > 0) && !isNaN(Number(val));
    }

    private isValidAnnotator(): boolean {
        return this.$scope.annotator.length > 0;
    }

    private isValidFile(): boolean {
        return (this.$scope.theFile != null) && (this.$scope.theFile.name.length > 0);
    }

    private updateDefaultTracingStructure() {
        if (this.$scope.structureId.length > 0) {
            return;
        }

        if (!this.$scope.structureIdentifierService.resourcesAreAvailable) {
            setTimeout(() => { this.updateDefaultTracingStructure(); }, 250);
            return;
        }

        let undefinedStructures = this.$scope.structureIdentifierService.structures.filter(obj => obj.value === 0);

        if (undefinedStructures.length > 0) {
            this.$scope.structureId = undefinedStructures[0].id;
        }
    }

    private updateInjections(sampleId) {
        this.$scope.injectionId = '';

        if (!sampleId || sampleId.length == 0) {
            this.$scope.injectionsForsample = [];
        } else {
            this.$scope.injectionsForSample = this.$scope.injectionService.injectionsForSample(sampleId);
            if (this.$scope.injectionsForSample.length > 0) {
                this.$scope.injectionId = this.$scope.injectionsForSample[0].id;
            }
        }
    }

    private updateNeurons(injectionId) {
        this.$scope.neuronId = '';

        if (!injectionId || injectionId.length == 0) {
            this.$scope.neuronsForInjection = [];
        } else {
            this.$scope.neuronsForInjection = this.$scope.neuronService.neuronsForInjection(injectionId);
            if (this.$scope.neuronsForInjection.length > 0) {
                this.$scope.neuronId = this.$scope.neuronsForInjection[0].id;
            }
        }
    }

    private send() {
        let tracingInfo = {
            annotator: this.$scope.annotator,
            neuronId: this.$scope.neuronId,
            structureIdentifierId: this.$scope.structureId
        };

        this.$scope.isInCreatePost = true;
        this.$scope.lastCreateMessage = 'Submitting...';

        this.$scope.tracingService.uploadSwcFile(this.$scope.theFile, tracingInfo).then((tracing: ITracing) => {
            this.$scope.$apply(() => {
                this.$scope.isInCreatePost = false;
                this.$scope.lastCreateMessage = 'Success'
            });
        }).catch((error) => {
            this.$scope.$apply(() => {
                this.$scope.isInCreatePost = false;
                this.$scope.lastCreateMessage = error.data.message;
            });
        });
    }
}

angular.module('tracingManager').controller('createTracingController', CreateTracingController);
