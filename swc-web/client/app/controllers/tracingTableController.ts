
    'use strict';

    class TracingTableController {
        public static $inject = [
            '$scope'
        ];

        constructor(private $scope: any) {
            this.$scope.itemsPerPage = 5;
            this.$scope.currentPage = 1;
            
            this.$scope.$on('createdTracingIndex', (evt, val) => this.onCreatedTracingIndex(val))

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
        
        private onCreatedTracingIndex(val) {
             var page: number = Math.floor(val/this.$scope.itemsPerPage) + 1;
             this.$scope.currentPage = page;
        }
    }

    angular.module('tracingManager').controller('tracingTableController', TracingTableController);

