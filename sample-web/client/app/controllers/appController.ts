interface IAppScope extends ng.IScope {
    service: ApiAccessService;
    injectionService: InjectionService;
    transformService: RegistrationTransformService;
    virusService: VirusService;
    brainAreaService: BrainAreaService;
    sampleService: SampleService;
    neuronService: NeuronService;
    mouseStrainService: MouseStrainService;
    fluorophoreService: FluorophoreService;

    apiUrl: string;
    apiDocUrl: string;
    statusUrl: string;

    formatSample(sampleId: string): string;
}

class AppController {
    public static $inject = [
        "$scope",
        "$resource",
        "apiAccessService",
        "injectionService",
        "registrationTransformService",
        "virusService",
        "brainAreaService",
        "sampleService",
        "neuronService",
        "mouseStrainService",
        "fluorophoreService"
    ];

    constructor(private $scope: IAppScope, private $resource: any, private serviceApi: ApiAccessService,
                private injectionService: InjectionService, private transformService: RegistrationTransformService,
                private virusService: VirusService, private brainAreaService: BrainAreaService,
                private sampleService: SampleService, private neuronService: NeuronService,
                private mouseStrainService: MouseStrainService, private fluorophoreService: FluorophoreService) {

        $scope.service = serviceApi;
        $scope.injectionService = injectionService;
        $scope.transformService = transformService;
        $scope.virusService = virusService;
        $scope.brainAreaService = brainAreaService;
        $scope.sampleService = sampleService;
        $scope.neuronService = neuronService;
        $scope.mouseStrainService = mouseStrainService;
        $scope.fluorophoreService = fluorophoreService;

        $scope.formatSample = (sampleId: string) => {
            return this.formatSample(sampleId);
        };

        $scope.$watch("service.serviceUrl", (val) => this.updateService(val));
        $scope.$watch("service.serviceDocUrl", (val) => this.updateServiceDoc(val));
        $scope.$watch("service.statusUrl", (val) => this.updateStatus(val));

        this.updateService(serviceApi.serviceUrl);
        this.updateServiceDoc(serviceApi.serviceDocUrl);
        this.updateStatus(serviceApi.statusUrl);
    }

    private updateService(val) {
        this.$scope.apiUrl = val;
    }

    private updateServiceDoc(val) {
        this.$scope.apiDocUrl = val;
    }

    private updateStatus(val) {
        this.$scope.statusUrl = val;
    }

    private formatSample(sampleId: string): string {
        return this.$scope.sampleService.getDisplayNameForId(sampleId);
    }

}

angular.module("sampleManager").controller("appController", AppController);

