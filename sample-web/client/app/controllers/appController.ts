/// <reference path="../../../../shared/client/services/brainAreaService.ts"/>
/// <reference path="../../../../shared/client/services/injectionService.ts"/>
/// <reference path="../../../../shared/client/services/neuronService.ts"/>
/// <reference path="../../../../shared/client/services/sampleService.ts"/>
/// <reference path="../../../../shared/client/services/strainService.ts"/>
/// <reference path="../../../../shared/client/services/structureIdentifierService.ts"/>
/// <reference path="../../../../shared/client/services/tracingNodeService.ts"/>
/// <reference path="../../../../shared/client/services/tracingService.ts"/>
/// <reference path="../../../../shared/client/services/transformService.ts"/>
/// <reference path="../../../../shared/client/services/virusService.ts"/>

class AppController {
  public static $inject = [
    "$scope",
    "$resource",
    "apiAccessService",
    "injectionService",
    "registrationTransformService",
    "virusService",
    "strainService",
    "brainAreaService",
    "sampleService",
    "neuronService"
  ];

  constructor(private $scope:any, private $resource:any, private serviceApi: ApiAccessService,
              private injectionService: InjectionService, private transformService: RegistrationTransformService,
              private virusService: VirusService, private strainService: StrainService, private brainAreaService: BrainAreaService,
              private sampleService: SampleService, private neuronService: NeuronService) {

    $scope.service = serviceApi;
    $scope.injectionService = injectionService;
    $scope.transformService = transformService;
    $scope.virusService = virusService;
    $scope.strainService = strainService;
    $scope.brainAreaService = brainAreaService;
    $scope.sampleService = sampleService;
    $scope.neuronService = neuronService;

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
}

angular.module("sampleManager").controller("appController", AppController);

