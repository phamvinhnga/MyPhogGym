(function () {
    'use strict';

    angular
        .module('app.home')
        .component('lichLamViecPage', {
            templateUrl: 'app/main/home/lichLamViec/lichLamViec.html',
            controller: lichLamViecController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function lichLamViecController(logger, errorHandler, abpApi, $uibModal, valid) {
        var vm = this;

        //--- đối tướng
        vm.caLamViecs = [];
        vm.lichLamViecs = [];
        vm.validation = valid;

        // -- fitter

        //--- methoad
        vm.showModal = showModal;
        activate();

        //--- function
        function activate() {
            getAll();
        }

        function getAll() {
            return abpApi.resolve('app.lichLamViec@getAllCaLamViec')
                .then(function (response) {
                    vm.caLamViecs = response;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function showModal(input) {
            var modalInstance = $uibModal.open({
                backdrop: false,
                component: 'lichLamViecCrud',
                resolve: {
                    lichLamViec: function () {
                        return { id: input.id };
                    }
                }
            });

            modalInstance.rendered.then(function () {
            });

            modalInstance.result.then(function () {
                getAll();
            });
        }
    }
})();
