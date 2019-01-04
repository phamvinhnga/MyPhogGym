(function () {
    'use strict';
    angular
        .module('app.sso')
        .component("registerCenterEdu", {
            templateUrl: 'app/main/sso-auth/register-edu/register-center/register-center.html',
            controller: registerCenterEduController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function registerCenterEduController($http, APPCONF, $scope, logger, errorHandler, storageService, abpApi, $rootScope, $state, requiredFactory, redirectFormFactory,
        $uibModal) {
        var vm = this;
        vm.requiredFactory = requiredFactory;
        vm.focusTenancyName = true;
        vm.isCreateTenant = false;
        vm.register = {
            email: "",
            password: "",
            passwordConfirm: "",
            imageFileName: "",
            typeMember: "center"
        };

        vm.loading = false;

        vm.onLoadImageLoGo = onLoadImageLoGo;

        vm.clearImageLoGo = clearImageLoGo;

        vm.saveRegister = saveRegister;

        vm.requiredTenancyName = requiredTenancyName;

        vm.checkUserName = checkUserName;
        
        ////===========================================================================================

        activate();

        /**
         * active function
         */
        function activate() {
        }
        // take data
        function saveRegister(form) {
            if (!form.$valid) {
                errorHandler.handleValidationErrors("Bạn Vui Lòng Kiểm Tra Lỗi", true);
                return;
            }
            //vm.register.diaChi = vm.register.diaChiThuongTru + "#" + vm.register.tinh;
            vm.loading = true;


            vm.register.emailAddress = vm.register.email;
            vm.register.tenancyName = vm.register.code;

            register();
        };
        

        

        function register() {
            vm.loading = true;
            var url = "api/register/registerTenant";
            return $http.post(APPCONF.baseUrl + url, vm.register)
            //var promise = abpApi.resolve('app.trungTamClient@register', vm.register);
            //return promise
                .then(function suc(response) {
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


        function onLoadImageLoGo(e, reader, file, fileList, fileOjects, fileObj) {

            vm.register.imageFileUrl = "data:image/jpeg;base64," + fileObj.base64;
            vm.register.imageFileName = fileObj.filename;
        };

        /**
         * clear template image image
         */
        function clearImageLoGo() {
            vm.register.imageFileName = null;
            vm.register.imageFileUrl = null;
        }


        function requiredTenancyName(tenancyName, ev) {
            if (!tenancyName) return;
            redirectFormFactory.resolve("/api/services/app/registration/CheckValidTenant", { tenancyName: tenancyName })
                .then(function (response) {
                    if (response) {
                        errorHandler.handleValidationErrors("Mã Cơ SỞ Giáo Dục Đã Tồn Tại", true);
                        $(ev.target).focus();
                    }
                    else
                        vm.focusTenancyName = false;
                })
        }

        function checkUserName(data, ev) {
            if (!data) return;
            return redirectFormFactory.resolve('api/services/app/registration/CheckRegisterUser', { email: data })
                .then(function (res) {
                    if (!res.canLogin) {
                        confirmEmail(ev);
                        //errorHandler.handleValidationErrors("Mail Đăng Ký Đã Tồn Tại", true);
                        //$(ev.target).focus();
                    }
                    else {
                        vm.isCreateTenant = false
                    };
                })
                .catch(function (error) {
                    errorHandler.handleAuthenticationErrors(error, true);
                })
                .finally(function () {

                })

        }
        

        function confirmEmail(ev) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                component: 'confirmEmailEdu',
                windowClass: 'center-modal',
                size: "sm",
                resolve: {
                    email: function () {
                        return angular.copy(vm.register.email);
                    }
                }
            });
            return modalInstance.result
                .then(function (response) {
                    if (!response) return;
                    if (response.notMe == false) {
                        $(ev.target).focus();
                    }
                    
                });
        }
        //function loginEmail() {
        //    var modalInstance = $uibModal.open({
        //        ariaLabelledBy: 'modal-title',
        //        ariaDescribedBy: 'modal-body',
        //        component: 'loginEmailEdu',
        //        windowClass: 'center-modal',
        //        size: "sm",
        //        resolve: {
        //            email: function () {
        //                return angular.copy(vm.register.email);
        //            }
        //        }
        //    });
        //    return modalInstance.result
        //        .then(function (response) {
        //            if (!response) return;
        //            if (response.accessLogin) {
        //                vm.register.password = response.password;
        //                vm.isCreateTenant = true;
        //            }
        //        });
        //}
        

        var changeIsCreateTenant = $scope.$watch('vm.isCreateTenant', function () {
            if (vm.isCreateTenant) {
                vm.register.password = "";
            }
        })
        $scope.$on("destroy", function () {
            changeIsCreateTenant();
        })
    }
})();
