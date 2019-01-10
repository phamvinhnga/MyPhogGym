(function () {
    'use strict';

    angular
        .module('app.home')
        .component('khachHangDetail', {
            templateUrl: 'app/main/home/khachHang/quanLyKhachHang/components/khachHang-crud/detail.html',
            controller: detailController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
    });

    function detailController( abpApi) {
        var vm = this;
        // -- cờ

        // -- Đối tượng
        vm.khachHang = {};

        // -- methoad
        vm.get = getkhachHang;
        vm.dismiss = dismiss;
        vm.soNgayConLai = soNgayConLai;
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

        function soNgayConLai(input) {
            var output = "";
            if (input.dichVu != null) {
                switch (input.dichVu.loaiGoi) {
                    case 1:
                        var ngayKetThuc = moment(input.ngayDangKy, 'YYYY-MM-DD').add(input.dichVu.soLuong, 'months');
                        output = moment(ngayKetThuc).diff(moment(), 'days') + " Ngày";
                        break;
                    case 2:
                        output = input.conLai + " Buổi";
                        break;
                    case 3:
                        output = input.conLai + " Ngày";
                        break;
                }
            }
            return output;
        }

        function dismiss() {
            vm.modalInstance.dismiss();
        }

    }
})();
