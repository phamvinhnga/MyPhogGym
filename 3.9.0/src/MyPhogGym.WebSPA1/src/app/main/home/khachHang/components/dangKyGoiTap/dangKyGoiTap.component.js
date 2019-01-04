(function () {
    'use strict';

    angular
        .module('app.home')
        .component('khachHangDangKyGoiTap', {
            templateUrl: 'app/main/home/khachHang/components/dangKyGoiTap/dangKyGoiTap.html',
            controller: khachHangDangKyGoiTapController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
        });

    function khachHangDangKyGoiTapController(logger, errorHandler, abpApi, $filter, valid) {
        var vm = this;
        //-- cờ
        vm.isConfirm = false;
        vm.validation = valid;

        // -- Đối tượng
        vm.khachHang = {};
        vm.dichVus = [];

        // -- methoad
        vm.get = getkhachHang;
        vm.update = update;
        vm.isDelete = isDelete;
        vm.dismiss = dismiss;
        vm.confirmHuyGoiTap = confirmHuyGoiTap;

        activate();

        // -- function
        function activate() {
        }

        function getkhachHang() {
            var input = vm.resolve.khachHang;
            if (input.id != null) {
                getAllDichVu();
                abpApi.resolve('app.khachHang@get', input)
                    .then(function (response) {
                        vm.khachHang = response;
                        vm.khachHang.lichTap = angular.fromJson(response.lichTap);
                    });
            }
        }

        function getAllDichVu() {
            var input = {
                maxResultCount: 999,
            };
            return abpApi.resolve('app.dichVu@getAll', input)
                .then(function (response) {
                    vm.dichVus = response.items;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function update() {
            vm.khachHang.conLai = vm.khachHang.conLai == null || vm.khachHang.conLai == 0 ? vm.khachHang.dichVu.soLuong : vm.khachHang.conLai;
            if (vm.khachHang.dichVuID != vm.khachHang.dichVu.id) {
                vm.khachHang.conLai = vm.khachHang.dichVu.soLuong;
                vm.khachHang.dichVuID = vm.khachHang.dichVu.id;
            }
            vm.khachHang.lichTap = JSON.stringify(vm.khachHang.lichTap);
            return abpApi.resolve('app.khachHang@dangKyGoiTap', vm.khachHang)
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

        function isDelete() {
            vm.isConfirm = !vm.isConfirm;
        }

        function confirmHuyGoiTap(input) {
            input.dichVuID = null;
            input.conLai = 0;
            input.lichTap = null;
            input.dangKy = null;
            return abpApi.resolve('app.khachHang@huyGoiTap', input)
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

        function dismiss() {
            vm.modalInstance.dismiss();
        }
    }
})();



