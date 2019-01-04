(function () {
    'use strict';

    angular
        .module('app.sso')
        .component("registerEdu", {
            templateUrl: "app/main/sso-auth/register-edu/register-edu.html",
            controllerAs: "vm",
            controller: RegisterEduController
        })

    /** @ngInject */
    function RegisterEduController($scope, abpApi, abpAuthService, errorHandler, authConfig, $state) {
        var vm = this;

        vm.form = {
            fullName: '',
            userName: '',
            iPassword: '',
            passwordConfirm: '',
            phoneNumber: '',
            emailAddress: ''
        }

        vm.isSubmiting = false;

        vm.register = register;

        active();

        function active() {
           
        }

        function register(form) {
            $scope.$broadcast('show-errors-check-validity');

            if (!form.$valid) {
                return;
            }

            vm.isSubmiting = true;

            return abpApi.resolve('app.customerClient@register', vm.form)
                .then(function (response) {
                    if (response) {
                        $state.go(authConfig.configuration().defaultLoginState);
                    }
                },
                function (error) {
                    if (error.status && error.status === -1) {
                        error.message = $translate.instant('REGISTER.ERRORS.NOT_VALID');
                    }
                    errorHandler.handleAuthenticationErrors(error, true);
                })
                .finally(function () {
                    vm.isSubmiting = false;
                });
        }
    }
})();
