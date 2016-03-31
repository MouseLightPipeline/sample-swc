/// <reference path="../../../typings/browser/ambient/jquery/index.d.ts"/>
/// <reference path="../../../typings/browser/ambient/angular/index.d.ts"/>

module SwcFile {
    'use strict';

    export class DropZoneController {
        public static $inject = [
            '$scope',
            '$http'
        ];

        constructor(private $scope: any, private $http: any) {            
            this.$scope.theFile = [];
            this.$scope.submitter = '';
            this.$scope.tag = '';
            
            this.$scope.send = () => this.send();
        }
        
        private send() {            
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
            });
        }
    }

    angular.module('swcFileManager').controller('dropzoneController', DropZoneController);
}
 