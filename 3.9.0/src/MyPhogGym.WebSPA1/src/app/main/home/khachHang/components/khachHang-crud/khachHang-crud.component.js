(function () {
    'use strict';

    angular
        .module('app.home')
        .component('khachHangCrud', {
            templateUrl: 'app/main/home/khachHang/components/khachHang-crud/khachHang-crud.html',
            controller: khachHangCrudController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
    });

    function khachHangCrudController(logger, errorHandler, abpApi, valid) {
        var vm = this;
        // -- cờ
        vm.isConfirm = false;
        vm.validation = valid;

        // -- Đối tượng
        vm.khachHang = {};
        vm.dichVus = [];
        // -- methoad
        vm.get = getkhachHang;
        vm.update = update;
        vm.showButtonDelete = showButtonDelete;
        vm.isDelete = isDelete;
        vm.dismiss = dismiss;
        vm.confirmDelete = confirmDelete;
        activate();

        // -- function
        function activate() {
        }

        function getkhachHang() {
            var input = vm.resolve.khachHang;
            if (input.id != null) {
                return abpApi.resolve('app.khachHang@get', input)
                    .then(function (response) {
                        vm.khachHang = response;
                    });
            }
        }

        function update() {
            var callApi = vm.khachHang.id == null ? 'app.khachHang@create' : 'app.khachHang@update';
            return abpApi.resolve(callApi, vm.khachHang)
                .then(function (response) {
                    vm.modalInstance.close();
                    logger.logSuccess('Cập nhật thành công', null, true);
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true); 
                })
                .finally(function () {
                });
        }

        function dismiss() {
            vm.modalInstance.dismiss();
        }

        function showButtonDelete() {
            return vm.khachHang.id == null ? false : true;
        }

        function isDelete() {
            vm.isConfirm = !vm.isConfirm;
        }

        function confirmDelete(input) {
            return abpApi.resolve('app.khachHang@delete', { id: input.id })
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
