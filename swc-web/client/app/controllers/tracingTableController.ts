/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
/// <reference path="../../../typings/globals/angular/index.d.ts"/>

module TracingManager {
    'use strict';

    export class TracingTableController {
        public static $inject = [
            '$scope'
        ];

        constructor(private $scope: any) {            
       }
    }

    angular.module('tracingManager').controller('tracingTableController', TracingTableController);
}
