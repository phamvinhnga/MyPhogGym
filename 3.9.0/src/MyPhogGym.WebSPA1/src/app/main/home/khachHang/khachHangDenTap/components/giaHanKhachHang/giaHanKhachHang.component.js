(function () {
    'use strict';

    angular
        .module('app.home')
        .component('giaHanKhachHang', {
            templateUrl: 'app/main/home/khachHang/khachHangDenTap/components/giaHanKhachHang/giaHanKhachHang.html',
            controller: giaHanKhachHangController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
        });

    function giaHanKhachHangController(logger, errorHandler, abpApi, valid) {
        var vm = this;
        // -- cờ
        vm.validation = valid;

        // -- Đối tượng
        vm.khachHang = {};
        vm.giaHan = {};

        // -- methoad
        vm.get = getkhachHang;
        vm.update = update;
        vm.dismiss = dismiss;
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
                        vm.khachHang.dichVu.lichTap = angular.fromJson(response.dichVu.lichTap);
                    });
            }
        }

        function update(input) {
            var maxSoBuoiGiaHan = vm.khachHang.dichVu.soLuong - vm.khachHang.conLai;
            if (input.soBuoi > maxSoBuoiGiaHan) {
                errorHandler.handleValidationErrors("Gia hạn tối đa là " + maxSoBuoiGiaHan + " buổi", true);
                return;
            }
            var khachHang = vm.khachHang;
            khachHang.conLai = vm.khachHang.conLai + input.soBuoi;
            khachHang.dichVuID = vm.khachHang.dichVu.id;

            return abpApi.resolve("app.khachHang@dangKyGoiTap", khachHang)
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
    }
})();
