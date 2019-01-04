(function () {
    'use strict';

    angular
        .module('app.work')
        .component('infoCenterHomeComponent', {
            templateUrl: 'app/main/home/components/info-center-home/components/info-center/info-center.html',
            controller: infoCenterHomeComponentController,
            controllerAs: 'vm',
            bindings: {
                thongTinTrungTam : '<'
            }
        });

    function infoCenterHomeComponentController(logger, errorHandler, abpApi, utilsService, $translate) {
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
