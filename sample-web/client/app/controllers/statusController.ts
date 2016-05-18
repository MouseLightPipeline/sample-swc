/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SampleManager {
    'use strict';

    export class StatusController {
        public static $inject = [
            '$scope',
            'apiAccessService'
        ];

       private asocket: any;
       
       constructor(private $scope: any, private serviceApi: ApiAccessService) {
             this.$scope.neuronCount = -1;
             this.$scope.sampleCount = -1;
             
             this.$scope.$watch('service.statusUrl', (val) => this.updateStatus(val));
       }
        
        private updateStatus(val) {
            /*
            if (val.length > 0) {
                this.asocket = io.connect('localhost:9642');          
                this.asocket.on('neuron_count', (val) => {
                    this.$scope.$apply(() => {
                        this.$scope.neuronCount = val;
                    });
                });
                this.asocket.on('sample_count', (val) => {
                    this.$scope.$apply(() => {
                        this.$scope.sampleCount = val;
                    });
                });
            }
            */
        }
    }

    angular.module('sampleManager').controller('statusController', StatusController);
}
