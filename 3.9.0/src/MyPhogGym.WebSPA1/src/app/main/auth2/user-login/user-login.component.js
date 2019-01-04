(function () {
    'use strict';

    angular
        .module('app.auth')
        .component("userLogin", {
            templateUrl: "app/main/auth2/user-login/user-login.html",
            controllerAs: "vm",
            controller: userLoginController,
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
        })

    /** @ngInject */
    function userLoginController(logger, $state, errorHandler, $location, $http, APPCONF, authService) {
        var vm = this;

        // đối tượng
        vm.tenancyName = "Default";
        vm.userLogin = { usernameOrEmailAddress: "admin", password: "123qwe" };

        // method
        vm.signIn = signIn;
        active();

        // function
        function active() {
            var token = $location.hash();
            authService.setAccessToken({ access_token: token });
        }

        function signIn(input) {
            var option = {
                usernameOrEmailAddress: input.usernameOrEmailAddress,
                password: input.password,
                tenancyName: vm.tenancyName,
                rememberMe: false
            };
            var url = "api/account";
            return $http.post(APPCONF.baseUrl + url, option)
                .then(function (response) {
                    response = response.data || response;
                    var token = response.token || response;
                    authService.setAccessToken({ access_token: token });
                    logger.logSuccess('Đăng nhập thành công', null, true);
                    $state.go('app.home.khach-hang-page');
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors("Đăng nhập không thành công", true);
                })
                .finally(function () {
                });
        }
    }
})();

//(function () {
//    'use strict';

//    angular
//        .module('app.auth')
//        .component("userLogin", {
//            templateUrl: "app/main/auth2/user-login/user-login.html",
//            controllerAs: "vm",
//            controller: userLoginController,
//            bindings: {
//                modalInstance: "<",
//                resolve: "<"
//            },
//        })

//    /** @ngInject */
//    function userLoginController(logger, errorHandler, $location, $http, APPCONF, authService) {
//        var vm = this;

//        // đối tượng
//        vm.tenancyName = "Default";
//        vm.userLogin = { usernameOrEmailAddress: "admin", password: "123qwe" };

//        // method
//        vm.login = login;
//        vm.cancel = cancel;
//        active();

//        // function
//        function active() {
//            var token = $location.hash();
//            authService.setAccessToken({ access_token: token });
//        }

//        function login() {
//            var option = {
//                usernameOrEmailAddress: vm.userLogin.usernameOrEmailAddress,
//                password: vm.userLogin.password,
//                tenancyName: vm.tenancyName,
//                rememberMe: false
//            };
//            var url = "api/account";
//            return $http.post(APPCONF.baseUrl + url, option)
//                .then(function (response) {
//                    response = response.data || response;
//                    var token = response.token || response;
//                    authService.setAccessToken({ access_token: token });
//                    logger.logSuccess('Đăng nhập thành công', null, true);
//                    vm.modalInstance.close();
//                })
//                .catch(function (error) {
//                    errorHandler.handleValidationErrors("Đăng nhập không thành công", true);
//                })
//                .finally(function () {
//                });
//        }

//        function cancel() {
//            vm.modalInstance.dismiss();
//        }
//    }
//})();
