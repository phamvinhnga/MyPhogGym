(function () {
    'use strict';

    angular
        .module('xyz')
        .component("webApplication", {
            templateUrl: 'app/main/infos/components/application/application.html',
            controller: webApplicationController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function webApplicationController($rootScope, $state) {
        var vm = this;

        vm.loading = false;

        vm.applicationName = "HỆ THỐNG QUẢN LÝ PHÒNG GYM";
        vm.applications = [];

        //===========================================================================================

        activate();

        /**
         * active function
         */
        function activate() {
        };
    }
})();
