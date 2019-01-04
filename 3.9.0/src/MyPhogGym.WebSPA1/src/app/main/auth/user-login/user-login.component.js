//(function () {
//    'use strict';

//    angular
//        .module('app.auth')
//        .component("userLogin", {
//            templateUrl: "app/main/auth/user-login/user-login.html",
//            controllerAs: "vm",
//            controller: userLoginController
//        })

//    /** @ngInject */
//    function userLoginController($location, $state, authService, $http, APPCONF) {
//        var vm = this;

//        active();

//        function active() {
//            var token = $location.hash();
//            authService.setAccessToken({ access_token: token });

//            updateApplication();

//            $state.go('app.home');
//        }

//        function updateApplication() {
//            var option = {
//                rememberMe: true,
//                rememberMeDuration: 1800,
//                applicationId: APPCONF.applicationId,
//                applicationCode: 'app'
//            }
            
//            var url = "api/ssoAccount/changeApplication/";
//            return $http.post(APPCONF.authUrl + url, option)
//                .then(function (response) {
//                    response = response.data || response;

//                    var token = response.token || response;

//                    authService.setAccessToken(token);
//                });
//        }
//    }
//})();
