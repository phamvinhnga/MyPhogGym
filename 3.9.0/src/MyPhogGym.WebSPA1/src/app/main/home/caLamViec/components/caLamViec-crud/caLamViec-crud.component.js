(function () {
    'use strict';

    angular
        .module('app.home')
        .component('caLamViecCrud', {
            templateUrl: 'app/main/home/caLamViec/components/caLamViec-crud/caLamViec-crud.html',
            controller: caLamViecCurdController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
    });

    function caLamViecCurdController(logger, errorHandler, abpApi, valid) {

        var vm = this;
        // -- cờ
        vm.isConfirm = false;

        //--- đối tượng
        vm.caLamViec = {};
        vm.validation = valid;

        //--- methoad
        vm.get = getCaLamViec;
        vm.update = update;
        vm.showButtonDelete = showButtonDelete;
        vm.isDelete = isDelete;
        vm.dismiss = dismiss;
        vm.confirmDelete = confirmDelete;

        activate();

        //-- function
        function activate() {
        }

        function getCaLamViec() {
            var input = vm.resolve.caLamViec;
            if (input.id != null) {
                return abpApi.resolve('app.caLamViec@get', input)
                    .then(function (response) {
                        vm.caLamViec = response;
                    });
            }
        }

        function dismiss() {
            vm.modalInstance.dismiss();
        }

        function update() {
            var callApi = vm.caLamViec.id == null ? 'app.caLamViec@create' : 'app.caLamViec@update';
            return abpApi.resolve(callApi, vm.caLamViec)
                .then(function (response) {
                    logger.logSuccess('Cập nhật thành công', null, true);
                    vm.modalInstance.close();
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function showButtonDelete() {
            return vm.caLamViec.id == null ? false : true;
        }

        function isDelete() {
            vm.isConfirm = !vm.isConfirm;
        }

        function confirmDelete(input) {
            return abpApi.resolve('app.caLamViec@delete', { id: input.id })
                .then(function (response) {
                    logger.logSuccess('Xóa thành công', null, true);
                    vm.modalInstance.close();
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }
    }
})();
