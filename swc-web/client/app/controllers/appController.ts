interface IAppScope extends ng.IScope {
    service: ApiAccessService;
    brainAreaService: BrainAreaService;
    injectionVirusService: InjectionVirusService;
    fluorophoreService: FluorophoreService;
    injectionService: InjectionService;
    mouseStrainService: MouseStrainService;
    sampleService: SampleService;
    neuronService: NeuronService;
    structureIdentifierService: StructureIdentifierService;
    tracingNodeService: TracingNodeService;
    tracingService: TracingService;
    tracingStructureService: TracingStructureService;

    apiUrl: string;
    apiDocUrl: string;
}

class AppController {
    public static $inject = [
        '$scope',
        '$resource',
        'apiAccessService',
        'brainAreaService',
        'injectionVirusService',
        'injectionService',
        'sampleService',
        'neuronService',
        'structureIdentifierService',
        'tracingNodeService',
        'tracingService',
        'tracingStructureService'
    ];

    constructor(private $scope: IAppScope, private $resource: any, private serviceApi: ApiAccessService,
                private brainAreaService: BrainAreaService,
                private injectionVirusService: InjectionVirusService, private injectionService: InjectionService,
                private sampleService: SampleService, private neuronService: NeuronService,
                private structureIdentifierService: StructureIdentifierService,
                private tracingNodeService: TracingNodeService, private tracingService: TracingService,
                private tracingStructureService: TracingStructureService) {

        $scope.service = serviceApi;
        $scope.brainAreaService = brainAreaService;
        $scope.injectionVirusService = injectionVirusService;
        $scope.injectionService = injectionService;
        $scope.sampleService = sampleService;
        $scope.neuronService = neuronService;
        $scope.structureIdentifierService = structureIdentifierService;
        $scope.tracingNodeService = tracingNodeService;
        $scope.tracingService = tracingService;
        $scope.tracingStructureService = tracingStructureService;

        $scope.$watch('service.serviceUrl', (val) => this.updateService(val));
        $scope.$watch('service.serviceDocUrl', (val) => this.updateServiceDoc(val));

        $scope.$on('createdTracingIndex', (evt, val) => this.onCreatedTracingIndex(val));

        this.updateService(serviceApi.serviceUrl);
        this.updateServiceDoc(serviceApi.serviceDocUrl);
    }

    private updateService(val) {
        this.$scope.apiUrl = val;
    }

    private updateServiceDoc(val) {
        this.$scope.apiDocUrl = val;
    }

    private onCreatedTracingIndex(val) {
        this.$scope.$broadcast('createdTracingIndex', val);
    }
}

angular.module('tracingManager').controller('appController', AppController);

