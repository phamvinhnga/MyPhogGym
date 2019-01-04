//(function () {
//    'use strict';

//    angular
//        .module('app.auth')
//        .component("userInfo", {
//            templateUrl: "app/main/auth/user-info/user-info.html",
//            controllerAs: "vm",
//            controller: userInfoController
//        })

//    /** @ngInject */
//    function userInfoController(abpApi, $http, $rootScope, authService, APPCONF, $state) {
//        var vm = this;

//        vm.settings = { layoutPath: 'app/themes/xyz/assets' };

//        vm.loginUrl = APPCONF.loginUrl;

//        vm.tenantName = "Chọn trung tâm";
//        vm.tenants = [];
//        vm.selectTenant = selectTenant;
//        vm.logout = logout;
//        vm.isAuthentication = isAuthentication;

//        active();

//        function active() {
//            vm.$onInit = function () {
//                vm.currentUser = $rootScope.currentUser;

//                $rootScope.$on('oauth:profile', function () {
//                    vm.currentUser = $rootScope.currentUser;
//                });

//                if (vm.isAuthentication()) {
//                    getTenants().then(function () {
//                        setTenant();
//                    });
//                }
//            };
//        }

//        function getTenants() {
//            var url = "api/services/app/userInfomation/GetLoginUserTenantsByApplication";
//            return $http.post(APPCONF.authUrl + url, { id: APPCONF.applicationId })
//                .then(function (response) {
//                    vm.tenants = [];
//                    _.each(response.data, function (item) {
//                        vm.tenants.push({ id: item.tenantId, name: item.tenant.tenancyName });
//                    });
//                })
//                .catch(function (err) {
//                })
//                .finally(function () {
//                })
//        }

//        /**
//            * Logout Function
//            */
//        function logout() {
//            authService
//                .logout()
//                .then(function () {
//                });
//        }

//        function isAuthentication() {
//            console.log(1);
//            console.log(authService.isAuthentication());
//            return authService.isAuthentication();
//        }

//        function selectTenant(tenant) {
//            var option = {
//                usernameOrEmailAddress: "email",
//                password: "password",
//                rememberMe: true,
//                rememberMeDuration: 1800,
//                tenantId: tenant != null? tenant.id : null,
//                applicationId: APPCONF.applicationId
//            }
//            var url = "api/ssoAccount/changeTenant/";
//            return $http.post(APPCONF.authUrl + url, option)
//                .then(function (response) {
//                    response = response.data || response;

//                    var token = response.token || response;

//                    authService.resetAccessToken(token);
                    
//                    if (authService.isAuthentication()) {
//                        vm.tenantName = tenant.name;
//                        $rootScope.$emit("loadProfileCenter");
//                        $state.go("app.work.center.profile-center");
                        
//                    }
                   
//                    return response;
//                })

//        }

//        function setTenant() {
//            if (vm.currentUser != null && vm.currentUser.tenantId != null) {
//                var find = _.find(vm.tenants, { id: vm.currentUser.tenantId });
//                if (find != null) {
//                    vm.tenantName = find.name;
//                }
//            }
//        }
//    }
//})();
