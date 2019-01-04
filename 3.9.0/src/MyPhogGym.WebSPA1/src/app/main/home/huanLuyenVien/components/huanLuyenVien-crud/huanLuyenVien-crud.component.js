(function () {
    'use strict';

    angular
        .module('app.home')
        .component('huanLuyenVienCrud', {
            templateUrl: 'app/main/home/huanLuyenVien/components/huanLuyenVien-crud/huanLuyenVien-crud.html',
            controller: huanLuyenVienCrudController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
    });

    function huanLuyenVienCrudController(logger, errorHandler, abpApi, valid) {
        var vm = this;
        // -- cờ
        vm.isConfirm = false;
        vm.validation = valid;

        // -- Đối tượng
        vm.huanLuyenVien = {};

        // -- methoad
        vm.get = getHuanLuyenVien;
        vm.update = update;
        vm.cancel = cancel;
        vm.showButtonDelete = showButtonDelete;
        vm.isDelete = isDelete;
        vm.confirmDelete = confirmDelete;

        activate();

        // -- function
        function activate() {
        }

        function getHuanLuyenVien() {
            var input = vm.resolve.huanLuyenVien;
            if (input.id != null) {
                return abpApi.resolve('app.huanLuyenVien@get', input)
                    .then(function (response) {
                        vm.huanLuyenVien = response;
                    });
            }
        }

        function cancel() {
            vm.modalInstance.dismiss();
        }

        function update() {
            console.log(vm.huanLuyenVien);
            var callApi = vm.huanLuyenVien.id == null ? 'app.huanLuyenVien@create' : 'app.huanLuyenVien@update';
            return abpApi.resolve(callApi, vm.huanLuyenVien)
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

        function showButtonDelete() {
            return vm.huanLuyenVien.id == null ? false : true;
        }

        function isDelete() {
            vm.isConfirm = !vm.isConfirm;
        }

        function confirmDelete(input) {
            return abpApi.resolve('app.huanLuyenVien@delete', { id: input.id })
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
