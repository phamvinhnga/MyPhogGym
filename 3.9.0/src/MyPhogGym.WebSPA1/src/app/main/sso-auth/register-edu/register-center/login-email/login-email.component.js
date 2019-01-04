(function () {
    'use strict';

    angular
        .module('app.sso')
        .component("loginEmailEdu", {
            templateUrl: "app/main/sso-auth/register-edu/register-center/login-email/login-email.html",
            controllerAs: "vm",
            controller: loginEmailEduController,
            bindings: {
                close: '&',
                dismiss: '&',
                modalInstance: '<',
                resolve: '<'
            }
        })

    /** @ngInject */
    function loginEmailEduController($scope, abpApi, abpAuthService, errorHandler, authConfig, $state, redirectFormFactory) {
        var vm = this;

        vm.login = login;

        active();


        function active() {
            vm.$onInit = function () {
                vm.usernameOrEmailAddress = vm.resolve.email;
            }
        }

        function login() {
            var option = {
                usernameOrEmailAddress: vm.usernameOrEmailAddress,
                password: vm.password,
                tenancyName: "Default",
                rememberMe: false
            }
            return redirectFormFactory.resolve("api/ssoAccount/authenticate", option)
                .then(function (response) {
                    vm.close({ $value: { accessLogin: true, password: vm.password} })
                })
                .catch(function () {
                    errorHandler.handleAuthenticationErrors("Chưa Chính Xác", true);
                })
                .finally(function () {

                })
        }
    }
})();
