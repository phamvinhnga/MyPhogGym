(function () {
    'use strict';

    angular
        .module('app.home')
        .component('infoRegisterHome', {
            templateUrl: 'app/main/home/components/student-register-course-home/dialogs/info-register-home/info-register-home.html',
            controller: infoRegisterHomeController,
            controllerAs: 'vm',
            bindings: {
                close: '&',
                dismiss: '&',
                modalInstance: '<',
                resolve: '<'
            }
        });

    /** @ngInject */
    function infoRegisterHomeController() {

        var vm = this;

        //===========================================================================================

        activate();

        /**
        * active function
        */
        function activate() {
        };

    }



})();
