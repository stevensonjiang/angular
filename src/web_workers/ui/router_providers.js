'use strict';"use strict";
var platform_location_1 = require('./platform_location');
var lang_1 = require('angular2/src/facade/lang');
var browser_platform_location_1 = require('angular2/src/router/location/browser_platform_location');
var core_1 = require('angular2/core');
exports.WORKER_RENDER_ROUTER = lang_1.CONST_EXPR([
    platform_location_1.MessageBasedPlatformLocation,
    browser_platform_location_1.BrowserPlatformLocation,
    lang_1.CONST_EXPR(new core_1.Provider(core_1.APP_INITIALIZER, { useFactory: initRouterListeners, multi: true, deps: lang_1.CONST_EXPR([core_1.Injector]) }))
]);
function initRouterListeners(injector) {
    return function () {
        var zone = injector.get(core_1.NgZone);
        zone.run(function () { return injector.get(platform_location_1.MessageBasedPlatformLocation).start(); });
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtN3piMW45aWIudG1wL2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy91aS9yb3V0ZXJfcHJvdmlkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrQ0FBMkMscUJBQXFCLENBQUMsQ0FBQTtBQUNqRSxxQkFBeUIsMEJBQTBCLENBQUMsQ0FBQTtBQUNwRCwwQ0FBc0Msd0RBQXdELENBQUMsQ0FBQTtBQUMvRixxQkFBMEQsZUFBZSxDQUFDLENBQUE7QUFFN0QsNEJBQW9CLEdBQUcsaUJBQVUsQ0FBQztJQUM3QyxnREFBNEI7SUFDNUIsbURBQXVCO0lBQ3ZCLGlCQUFVLENBQ04sSUFBSSxlQUFRLENBQUMsc0JBQWUsRUFDZixFQUFDLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBVSxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7Q0FDaEcsQ0FBQyxDQUFDO0FBRUgsNkJBQTZCLFFBQWtCO0lBQzdDLE1BQU0sQ0FBQztRQUNMLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBTSxDQUFDLENBQUM7UUFFaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnREFBNEIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFsRCxDQUFrRCxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TWVzc2FnZUJhc2VkUGxhdGZvcm1Mb2NhdGlvbn0gZnJvbSAnLi9wbGF0Zm9ybV9sb2NhdGlvbic7XG5pbXBvcnQge0NPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jyb3dzZXJQbGF0Zm9ybUxvY2F0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uL2Jyb3dzZXJfcGxhdGZvcm1fbG9jYXRpb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIFByb3ZpZGVyLCBJbmplY3RvciwgTmdab25lfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfUk9VVEVSID0gQ09OU1RfRVhQUihbXG4gIE1lc3NhZ2VCYXNlZFBsYXRmb3JtTG9jYXRpb24sXG4gIEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uLFxuICBDT05TVF9FWFBSKFxuICAgICAgbmV3IFByb3ZpZGVyKEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICAgICAgICAgICB7dXNlRmFjdG9yeTogaW5pdFJvdXRlckxpc3RlbmVycywgbXVsdGk6IHRydWUsIGRlcHM6IENPTlNUX0VYUFIoW0luamVjdG9yXSl9KSlcbl0pO1xuXG5mdW5jdGlvbiBpbml0Um91dGVyTGlzdGVuZXJzKGluamVjdG9yOiBJbmplY3Rvcik6ICgpID0+IHZvaWQge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCB6b25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG5cbiAgICB6b25lLnJ1bigoKSA9PiBpbmplY3Rvci5nZXQoTWVzc2FnZUJhc2VkUGxhdGZvcm1Mb2NhdGlvbikuc3RhcnQoKSk7XG4gIH07XG59XG4iXX0=