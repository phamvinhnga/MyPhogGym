(function () {
    'use strict';
    angular
        .module('app.sso')
        .component("registerOrtherEdu", {
            templateUrl: 'app/main/sso-auth/register-edu/register-other/register-other.html',
            controller: registerOtherEduController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function registerOtherEduController($http, APPCONF, $scope,$stateParams, logger, errorHandler, abpApi, $rootScope, $state, requiredFactory, ortherUserFactory, redirectFormFactory) {
        var vm = this;

        vm.requiredFactory = requiredFactory;
        vm.listOtherUser = ortherUserFactory.listOther;
        vm.register = { };
        vm.loading = false;

        vm.checkUserName = checkUserName;

        vm.saveRegister = saveRegister;

        ////===========================================================================================

        activate();
        /**
        * active function
        */
        function activate() {
            vm.register.typeUser = $stateParams.orderUser;
        }
        // take data
        function saveRegister(form) {
            if (!form.$valid) {
                errorHandler.handleValidationErrors("Bạn Vui Lòng Kiểm Tra Lỗi", true);
                return;
            }
            vm.loading = true;

            // register redirecform
            registerRedirectForm();
        };

        function registerRedirectForm() {
            vm.loading = true;
            // conver register Data from SSO
            vm.register.name = vm.register.ten;
            vm.register.surname = vm.register.hoTenDem;
            vm.register.emailAddress = vm.register.email;
            var url = "api/register/registerUser";
            return $http.post(APPCONF.baseUrl + url, vm.register)
         //   return redirectFormFactory.resolve("api/services/app/registration/RegisterUser", vm.register)
                .then(function (response) {
                    logger.logSuccess('Tạo Thành Công', null, true);
                    $state.go('app.home');
                })
                .catch(function err(error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function fin() {
                    vm.loading = false;
                });
        }

        function checkUserName(data, ev) {
            if (!data) return;
            return redirectFormFactory.resolve('api/services/app/registration/CheckRegisterUser', { email: data })
                .then(function (res) {
                    if (!res.canLogin) {
                        errorHandler.handleValidationErrors("Mail Đăng Ký Đã Tồn Tại", true);
                        $(ev.target).focus();
                    }
                })
                .catch(function (error) {
                    errorHandler.handleAuthenticationErrors(error, true);
                })
                .finally(function () {
                })
        }
    }
})();
