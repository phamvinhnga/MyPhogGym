(function () {
    'use strict';

    angular
        .module('app.sso')
        .component('sso', {
            templateUrl: 'app/main/sso-auth/sso.html',
            controller: ssoController,
            controllerAs: 'vm',
            bindings: {

            }
        });

    function ssoController(logger, errorHandler, abpApi, utilsService, $translate) {
        var vm = this;
        //===========================================================================================
        
        active();

        /**
         * active function
         */
        function active() {
        }

    }
})();
