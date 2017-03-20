class ApiAccessService {
    public static $inject = [
        '$resource',
        '$location',
        'brainAreaService',
        'injectionVirusService',
        'injectionService',
        'sampleService',
        'neuronService',
        'tracingService',
        'tracingNodeService',
        'structureIdentifierService',
        'tracingStructureService',
    ];

    public haveService: boolean;
    public serviceUrl: string;
    public serviceDocUrl: string;
    public sampleServiceUrl: string;

    private apiLocation: any;

    constructor(private $resource: any, private $location: any, private brainAreaService: BrainAreaService,
                private injectionVirusService: InjectionVirusService, private injectionService: InjectionService,
                private sampleService: SampleService, private neuronService: NeuronService, private tracingService: TracingService,
                private tracingNodeService: TracingNodeService, private structureIdentifierService: StructureIdentifierService,
                private tracingStructureService: TracingStructureService) {
        this.haveService = false;
        this.serviceUrl = '';
        this.serviceDocUrl = '';
        this.sampleServiceUrl = '';

        this.apiLocation = $resource('/service', {});

        this.apiLocation.get((api, headers) => this.update(api));
    }

    private update(api) {
        this.serviceUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/' + api.service.api + '/';
        this.serviceDocUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/docs';
        this.sampleServiceUrl = 'http://' + this.$location.host() + ':' + api.sampleService.port + '/' + api.sampleService.api + '/';

        this.haveService = true;

        this.brainAreaService.setLocation(this.sampleServiceUrl);
        this.injectionService.setLocation(this.sampleServiceUrl);
        this.injectionVirusService.setLocation(this.sampleServiceUrl);
        this.sampleService.setLocation(this.sampleServiceUrl);
        this.neuronService.setLocation(this.sampleServiceUrl);
        this.tracingService.setLocation(this.serviceUrl);
        this.tracingNodeService.setLocation(this.serviceUrl);
        this.structureIdentifierService.setLocation(this.serviceUrl);
        this.tracingStructureService.setLocation(this.serviceUrl);
    }
}

angular.module('tracingManager').service('apiAccessService', ApiAccessService);

