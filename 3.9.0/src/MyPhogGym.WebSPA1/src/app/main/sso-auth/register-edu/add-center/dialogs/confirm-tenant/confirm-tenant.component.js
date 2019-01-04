(function () {
    'use strict';

    angular
        .module('app.sso')
        .component('confirmTenantAddUser', {
            templateUrl: 'app/main/sso-auth/register-edu/add-center/dialogs/confirm-tenant/confirm-tenant.html',
            controller: confirmTenantAddUserController,
            controllerAs: 'vm',
            bindings: {
                close: '&',
                dismiss: '&',
                modalInstance: '<',
                resolve: '<'
            }
        });

    /** @ngInject */
    function confirmTenantAddUserController() {
        var vm = this;


        //===========================================================================================
        vm.submit = submit;

        active();

        /**
         * active function
         */
        function active() {
            vm.$onInit = function () {
            }
        }
        function submit(value) {
            vm.close({ $value : value });
        }
        

    }

})();
