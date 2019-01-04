(function () {
    'use strict';

    angular
        .module('app.home')
        .component("alertMessager", {
            templateUrl: 'app/main/infos/components/alert/alert.html',
            controller: alertMessagerController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function alertMessagerController($scope, logger, errorHandler, abpApi, storageService) {
        var vm = this;

        //===========================================================================================

        activate();

        /**
         * active function
         */
        function activate() {
            //$scope.$on('ShowErrorMessage', function (event, error) {
            //    if (error.data.details == 'Invalid user name or password') {
            //        error.data.details = document.getElementsByClassName("message-login-invalid")[0].innerHTML;
            //    }
            //    else if (error.data.details == 'Invalid user name or password') {
            //        error.data.details = document.getElementsByClassName("message-login-invalid")[0].innerHTML;
            //    }
            //    errorHandler.handleValidationErrors(error, true);
            //})
        };
    }
})();
