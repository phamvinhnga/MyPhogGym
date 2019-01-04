(function () {
    'use strict';

    angular
        .module('app.auth')
        .component("userInfo", {
            templateUrl: "app/main/auth2/user-info/user-info.html",
            controllerAs: "vm",
            controller: userInfoController
        })

    /** @ngInject */
    function userInfoController($state, logger, errorHandler, authService, $uibModal, $rootScope, APPCONF) {

        var vm = this;

        //--- đối tượng
        vm.currentUser;
        vm.settings = { layoutPath: 'app/themes/xyz/assets' };
        vm.loginUrl = APPCONF.loginUrl;

        //---methoad
        vm.logout = logout;
        vm.isAuthentication = isAuthentication;

        active();

        //-- function
        function active() {
            vm.currentUser = $rootScope.currentUser;
            $rootScope.$on('oauth:profile', function () {
                vm.currentUser = $rootScope.currentUser;
            });
            vm.$onInit = function () {
                vm.currentUser = $rootScope.currentUser;

                $rootScope.$on('oauth:profile', function () {
                    vm.currentUser = $rootScope.currentUser;
                });

            };
            if (!isAuthentication()) {
                $state.go('app.auth_login');
            }
        }

        function isAuthentication() {
            return authService.isAuthentication();
        }

        function logout() {
            authService.logout().then(function () {
                logger.logSuccess('Đăng xuất thành công', null, true);
                $state.go('app.auth_login');
            })
            .catch(function (error) {
                errorHandler.handleValidationErrors(error, true);
            })
            .finally(function () {
            });
        }

    }
})();
