(function () {
    'use strict';

    angular
        .module('app.sso')
        .component("loginEdu", {
            templateUrl: "app/main/sso-auth/login-edu/login-edu.html",
            controllerAs: "vm",
            controller: LoginEduController
        })

    /** @ngInject */
    function LoginEduController($location, $state, $scope, abpApi, abpAuthService, ssoAuthService, errorHandler, $translate, authConfig, $uibModal, storageService, redirectFormFactory) {
        // Data
        var vm = this;

        active();

        function active() {
            var token = $location.hash();
            ssoAuthService.setToken({access_token : token });
            $state.go('app.home.home-page');
        }
    }
})();
