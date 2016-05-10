/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SampleManager {
    'use strict';

    export class SampleController {
        public static $inject = [
            '$scope',
            '$http',
            'serviceApiService'
        ];

        constructor(private $scope: any, private $http: any, private serviceApi: ServiceApiService) {
            this.$scope.model = {};
            this.$scope.model.datestamp = '';
            this.$scope.model.comment = '';
            this.$scope.model.tag = '';
            this.$scope.model.injectionLocation = '';
            this.$scope.model.registrationTransform = '';
            this.$scope.model.virus = '';
            this.$scope.model.strain = '';
            
            this.$scope.fields = {};
            this.$scope.fields.injectionLocations = [];
            this.$scope.fields.registrationTransforms = [];
            this.$scope.fields.viruses = [];
            this.$scope.fields.strains = [];

            this.$scope.send = () => this.send();

            this.$scope.model.tag = serviceApi.host;

            this.$scope.$watch('api', (newValue, oldValue) => {
                this.$scope.model.tag = newValue;
                if (newValue.length > 0) {
                    this.$http.get(this.serviceApi.host + 'injections').then((obj) => {
                        this.$scope.fields.injectionLocations = obj.data;
                    }).then( () => {
                    this.$http.get(this.serviceApi.host + 'transforms').then((obj) => {
                        this.$scope.fields.registrationTransforms = obj.data;
                    });
                }
            });
        }

        private send() {
            console.log(this.$scope.model.injectionLocation);
            /*
            console.log(this.serviceApi.host + 'injections');
            this.$http.get(this.serviceApi.host + 'injections').then((obj) => {
                console.log('done');
                console.log(obj);
            })*/
            /*       
            let url = '/api/v1/upload';
            
            let fd = new FormData();
            fd.append('contents', this.$scope.theFile);
            this.$http.post(url, fd, {
                params: {submitter: this.$scope.submitter, tag: this.$scope.tag},
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .then(function(){
                console.log('uploaded');
            })
            .catch(function(){
                console.log('errored');
            });*/
        }
    }

    angular.module('sampleManager').controller('sampleController', SampleController);
}
