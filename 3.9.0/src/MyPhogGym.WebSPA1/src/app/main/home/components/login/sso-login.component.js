(function () {
    'use strict';

    angular
        .module('app.home')
        .component('ssoLogin', {
            templateUrl: 'app/main/home/components/login/sso-login.html',
            controller: ssoLoginController,
            controllerAs: 'vm',
            bindings: {
            }
        });

    function ssoLoginController($sce) {
        var vm = this;

        //vm.ssoLogin = $sce.trustAsResourceUrl('http://abc/auth/login');
        
        //===========================================================================================

        active();

        /**
         * active function
         */
        function active() {
        }
    }
})();
