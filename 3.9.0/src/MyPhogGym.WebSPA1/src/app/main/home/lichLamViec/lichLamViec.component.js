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

    function lichLamViecController(logger, errorHandler, abpApi, $uibModal) {
        var vm = this;

        //--- đối tướng
        vm.caLamViecs = [];
        vm.search = null;

        // -- fitter

        //--- methoad
        vm.showModal = showModal;
        vm.compare = compare;
        activate();

        //--- function
        function activate() {
            getAll();
        }

        function getAll() {
            return abpApi.resolve('app.lichLamViec@getAllCaLamViec')
                .then(function (response) {
                    vm.caLamViecs = response;
                    console.log(response);
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

        function compare(hoTen) {
            if (hoTen.indexOf(vm.search) != -1 || vm.search == null) {
                return true;
            } else {
                return false;
            }
        }
    }
})();
