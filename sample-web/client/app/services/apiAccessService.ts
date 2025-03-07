class ApiAccessService {
    public static $inject = [
        "$resource",
        "$location",
        "injectionService",
        "registrationTransformService",
        "injectionVirusService",
        "brainAreaService",
        "sampleService",
        "neuronService",
        "mouseStrainService",
        "fluorophoreService"
    ];

    public haveService: boolean;
    public serviceUrl: string;
    public serviceDocUrl: string;

    private apiLocation: any;

    constructor(private $resource: any, private $location: any, private injectionService: InjectionService,
                private transformService: RegistrationTransformService, private injectionVirusService: InjectionVirusService,
                private brainAreaService: BrainAreaService, private sampleService: SampleService,
                private neuronService: NeuronService, private mouseStrainService: MouseStrainService,
                private fluorophoreService: FluorophoreService) {
        this.haveService = false;
        this.serviceUrl = "";
        this.serviceDocUrl = "";

        this.apiLocation = $resource("/service", {});

        this.apiLocation.get((api, headers) => this.update(api));
    }

    private update(api) {
        this.serviceUrl = "http://" + this.$location.host() + ":" + api.service.port + "/" + api.service.api + "/";
        this.serviceDocUrl = "http://" + this.$location.host() + ":" + api.service.port + "/docs";

        this.haveService = true;

        this.injectionService.setLocation(this.serviceUrl);
        this.transformService.setLocation(this.serviceUrl);
        this.injectionVirusService.setLocation(this.serviceUrl);
        this.brainAreaService.setLocation(this.serviceUrl);
        this.sampleService.setLocation(this.serviceUrl);
        this.neuronService.setLocation(this.serviceUrl);
        this.mouseStrainService.setLocation(this.serviceUrl);
        this.fluorophoreService.setLocation(this.serviceUrl);
    }
}

angular.module("sampleManager").service("apiAccessService", ApiAccessService);
