/// <reference path="../typings/globals/jquery/index.d.ts"/>
/// <reference path="../typings/globals/angular/index.d.ts"/>
/// <reference path="../typings/globals/angular-resource/index.d.ts"/>
/// <reference path="../typings/globals/jasmine/index.d.ts" />
describe('Injection Location Service', function () {
    var $resource;
    beforeAll(function () {
        $resource = angular.injector(['ngResource']).get('$resource');
    });
    it('Service should not be null.', function () {
        var injectionService = new ndbservices.InjectionService($resource);
        expect(injectionService).toBeDefined();
    });
    it('Should return default injection locations.', function (done) {
        var injectionService = new ndbservices.InjectionService($resource);
        injectionService.setLocation('http://localhost:9641/api/v1/').then(function (success) {
            expect(injectionService.resourcesAreAvailable).toBeTruthy();
            expect(injectionService.items.length).toEqual(2);
            done();
        }).catch(function (error) {
            expect(error).toBeUndefined();
        });
    });
});
