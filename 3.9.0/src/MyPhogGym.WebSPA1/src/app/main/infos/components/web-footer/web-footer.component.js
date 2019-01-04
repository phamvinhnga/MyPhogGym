(function () {
    'use strict';

    angular
        .module('xyz')
        .component("webFooter", {
            templateUrl: 'app/main/infos/components/web-footer/web-footer.html',
            controller: webFooterController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function webFooterController() {
        var vm = this;

        vm.loading = false;

        //===========================================================================================

        activate();

        /**
         * active function
         */
        function activate() {
        };
    }
})();
