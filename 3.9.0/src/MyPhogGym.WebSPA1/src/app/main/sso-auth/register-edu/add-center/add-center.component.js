(function () {
    'use strict';
    angular
        .module('app.sso')
        .component("addCenterEdu", {
            templateUrl: 'app/main/sso-auth/register-edu/add-center/add-center.html',
            controller: addCenterEduController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function addCenterEduController($http, APPCONF, logger, errorHandler, $state, requiredFactory, redirectFormFactory, $uibModal) {
        var vm = this;
        vm.requiredFactory = requiredFactory;
        vm.focusTenancyName = true;

        vm.register = {};

        vm.loading = false;

        vm.saveRegister = saveRegister;

        vm.requiredTenancyName = requiredTenancyName;



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
            vm.loading = true;
            vm.register.tenancyName = vm.register.code;

            register();
        };

        function register() {
            vm.loading = true;
            var url = "api/register/addTenant";
            return $http.post(APPCONF.baseUrl + url, vm.register)
                //var promise = abpApi.resolve('app.trungTamClient@addTrungTam', vm.register);
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

        function requiredTenancyName(tenancyName, ev) {
            if (!tenancyName) return;
            redirectFormFactory.resolve("/api/services/app/registration/CheckValidTenant", { tenancyName: tenancyName })
                .then(function (response) {
                    if (response) {
                        confirmEmail()
                            .then(function (value) {
                                if (!value) return;
                                $state.go('app.sso.join-organization', { tenant: tenancyName });

                            })
                    }
                    else
                        vm.focusTenancyName = false;
                })
        }
        function confirmEmail(ev) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                component: 'confirmTenantAddUser',
                windowClass: 'center-modal',
                size: "sm",
                resolve: {
                    code: function () {
                        return vm.register.code;
                    }
                }
            });
            return modalInstance.result
                .then(function (response) {
                    return response;
                });
        }


    }
})();
