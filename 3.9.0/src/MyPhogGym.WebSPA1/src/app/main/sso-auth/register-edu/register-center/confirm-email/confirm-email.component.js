(function () {
    'use strict';

    angular
        .module('app.sso')
        .component('confirmEmailEdu', {
            templateUrl: 'app/main/sso-auth/register-edu/register-center/confirm-email/confirm-email.html',
            controller: confirmEmailEduController,
            controllerAs: 'vm',
            bindings: {
                close: '&',
                dismiss: '&',
                modalInstance: '<',
                resolve: '<'
            }
        });

    function confirmEmailEduController(APPCONF) {
        var vm = this;
       
        vm.notMe = notMe;
        vm.loginUrl = APPCONF.loginUrl;
        
        //===========================================================================================

        active();

        /**
         * active function
         */
        function active() {
            vm.$onInit = function () {
                vm.email = vm.resolve.email;
            }
        }
       
        function notMe(value) {
           
            vm.close({ $value: { notMe: value } })
        }

    }
})();
