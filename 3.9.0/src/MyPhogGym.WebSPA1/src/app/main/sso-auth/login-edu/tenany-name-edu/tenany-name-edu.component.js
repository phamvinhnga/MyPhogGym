(function () {
    'use strict';

    angular
        .module('app.sso')
        .component('tenancyNameEdu', {
            templateUrl: 'app/main/sso-auth/login-edu/tenany-name-edu/tenany-name-edu.html',
            controller: tenancyNameEduController,
            controllerAs: 'vm',
            bindings: {
                close: '&',
                dismiss: '&',
                modalInstance: '<',
                resolve: '<'
            }
        });

    function tenancyNameEduController(logger, errorHandler, abpApi, utilsService, $translate, redirectFormFactory) {
        var vm = this;
        vm.saveObj = saveObj;

        //===========================================================================================

        active();

        /**
         * active function
         */
        function active() {
            vm.$onInit = function () {
                vm.tenancyName = vm.resolve.tenancyName
            }
        }
        function saveObj() {
            if (!vm.tenancyName) {
                vm.close({ $value: { tenancyName: vm.tenancyName } });
            }
            else
                // kiem tra tenancyName
                redirectFormFactory.resolve("/api/services/app/registration/CheckValidTenant", { tenancyName: vm.tenancyName })
                    .then(function (response) {
                        if (!response)
                            errorHandler.handleValidationErrors("Mã Cơ Sở Giáo Dục Chưa Chính Xác", true);
                        else
                            vm.close({ $value: { tenancyName: vm.tenancyName } });
                    })

        }

    }
})();
