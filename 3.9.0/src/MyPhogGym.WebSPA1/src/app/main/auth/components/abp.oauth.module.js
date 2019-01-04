(function () {
    'use strict';

    angular
        .module('app.abp.oauth', ['app.abp', 'app.oauth'])
        .run(run)
        .factory('abpAuthService', abpAuthService);

    /** @ngInject */
    function run($rootScope, $log, abpEvent, abpAuth, abpSession, authService) {

        checkAndUpdatePermissions();

        function checkAndUpdatePermissions() {
            authService.checkAthentication();
        }
    }

    /** @ngInject */
    function abpAuthService(authService, AccessToken, abpAuth) {

        var factory = angular.extend({}, authService, {
            authorize: authorize,
            isAuthentication: isAuthentication,
            logout: logout

        });

        return factory;

        function isAuthentication() {
            return authService.isAuthentication();
        }

        function authorize() {
            return authService.authorize.call(this, arguments);
        }

        function logout() {
            return authService.logout()
                .then(function () {
                });
        }
    }
})();
