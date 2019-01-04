(function () {
    'use strict';

    angular
        .module('app.home')
        .component('khachHangDetail', {
            templateUrl: 'app/main/home/khachHang/components/khachHang-crud/detail.html',
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
                        vm.khachHang.lichTap = angular.fromJson(response.lichTap);
                    });
            }
        }

        function soNgayConLai(input) {
            console.log(input);
            var output;
            switch (input.dichVu.loaiGoi) {
                case 1:
                    var ngayKetThuc = moment(input.dangKy, 'YYYY-MM-DD').add(input.dichVu.soLuong, 'months');
                    output = moment(ngayKetThuc).diff(moment(), 'days') + " Ngày";
                    break;
                case 2:
                    output = input.conLai + " Buổi";
                    break;
                default:
                    output = input.conLai + " Ngày";
                    break;
            }
            return output;
        }

        function dismiss() {
            vm.modalInstance.dismiss();
        }

    }
})();
