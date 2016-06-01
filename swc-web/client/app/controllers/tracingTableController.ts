module TracingManager {
    'use strict';

    export class TracingTableController {
        public static $inject = [
            '$scope'
        ];

        constructor(private $scope: any) {
            this.$scope.neuronDisplayForId = (id: string) : any => {
                return this.neuronDisplayForId(id);
            };
        }
        
        private neuronDisplayForId(id: string): any {
            var obj = this.$scope.neuronService[id];
            
            if (obj == null) {
                return '(not found)';
            } else {
                return obj.idNumber + ' (' + obj.id + ')';
            }
        }
    }

    angular.module('tracingManager').controller('tracingTableController', TracingTableController);
}
