interface IModalController<T> {
    open(callerContext: T);
}

interface ISelectMouseStrainControllerContext {
    name: string;
    sample: ISample;
}

class ModalService {
    public static $inject = [];

    private _selectMouseStrainController: any;
    private _selectRegistrationTransformController: any;
    private _inspectSampleController: any;

    constructor() {
    }

    public registerSelectMouseStrainController(controller: any) {
        this._selectMouseStrainController = controller;
    }

    public openSelectMouseStrainController(callerContext: ISelectMouseStrainControllerContext) {
        this._selectMouseStrainController.open(callerContext);
    }

    public registerRegistrationTransformController(controller: any) {
        this._selectRegistrationTransformController = controller;
    }

    public openRegistrationTransformController(callerContext: ISample) {
        this._selectRegistrationTransformController.open(callerContext);
    }

    public registerInspectSampleController(controller: any) {
        this._inspectSampleController = controller;
    }

    public openInspectSampleController(callerContext: ISample) {
        this._inspectSampleController.open(callerContext);
    }

    public static safeApply = function (scope, fn) {
        var phase = scope.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            scope.$apply(fn);
        }
    }
}

angular.module("sampleManager").service("modalService", ModalService);
