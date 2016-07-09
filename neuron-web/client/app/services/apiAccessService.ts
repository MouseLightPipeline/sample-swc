module TracingManager {
    'use strict';

    export class ApiAccessService {
        public static $inject = [
            '$resource',
            '$location'
        ];        
        
        public haveService: boolean;
        public serviceUrl: string;        
        public serviceDocUrl: string;
 
        private apiLocation: any;

        constructor(private $resource: any, private $location: any) {
            this.haveService = false;
            this.serviceUrl = '';
            this.serviceDocUrl = '';
           
            this.apiLocation = $resource('/service', {});
            
            this.apiLocation.get((api, headers) => this.update(api));
        }
        
        private update(api) {
            this.serviceUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/' + api.service.api + '/';
            this.serviceDocUrl = 'http://' + this.$location.host() + ':' + api.service.port + '/docs';
            
            this.haveService = true;
        }
    }

    angular.module('ndb').service('apiAccessService', ApiAccessService);
}
