/// <reference path="../typings/globals/jquery/index.d.ts"/>
/// <reference path="../typings/globals/angular/index.d.ts"/>
/// <reference path="../typings/globals/angular-resource/index.d.ts"/>
/// <reference path="../typings/globals/jasmine/index.d.ts" />

describe('Injection Location Service', () => {
    
    var $resource;
    
    beforeAll(() => {
        $resource =  angular.injector(['ngResource']).get('$resource');
    })

    it ('Service should not be null.', () => {
        var injectionService = new InjectionService($resource);
        
        expect(injectionService).toBeDefined();
    });    

    it ('Should return default injection locations.', (done) => {
        
        var injectionService = new InjectionService($resource);
        
        injectionService.setLocation('http://localhost:9641/api/v1/').then((success) => {
            expect(injectionService.resourcesAreAvailable).toBeTruthy();
            expect(injectionService.items.length).toEqual(2);
            done();
        }).catch((error) => {
            expect(error).toBeUndefined();
        });
        
    });    
});
