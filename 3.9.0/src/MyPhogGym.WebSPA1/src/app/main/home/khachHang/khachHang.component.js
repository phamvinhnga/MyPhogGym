(function () {
    'use strict';

    angular
        .module('app.home')
        .component('khachHangPage', {
            templateUrl: 'app/main/home/khachHang/khachHang.html',
            controller: khachHangController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function khachHangController(logger, errorHandler, abpApi, $uibModal) {
        var vm = this;
        // -- đôi tượng
        vm.khachHangs = [];

        // -- filter 
        vm.filter = {
            keySearch: null,
        };

        // -- phan trang
        vm.pagenation = {
            maxResultCount: 10,
            skipCount: 0,
            pageList: [],
            next: {},
            pre: {},
            indexPage: 0
        };

         //--- methoad
        vm.showModalThongTinKhachHang = showModalThongTinKhachHang;
        vm.showModalDangKyGoiTapModal = showDangKyGoiTapModal;
        vm.showModalKhachHangDetail = showModalKhachHangDetail;
        vm.soNgayConLai = soNgayConLai;
        vm.filterData = filterData;

        // -- activate function
        activate()

        // -- function
        function activate() {
            getAll();
        }

        function getAll() {
            var input = {
                keySearch: vm.filter.keySearch,
                maxResultCount: 999
            };

            return abpApi.resolve('app.khachHang@getAll', input)
                .then(function (response) {
                    vm.khachHangs = response.items;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function showModalThongTinKhachHang(input) {
            var modalInstance = $uibModal.open({
                backdrop: false,
                component: 'khachHangCrud',
                resolve: {
                    khachHang: function () {
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

        function filterData() {
            getAll();
        }

        function showDangKyGoiTapModal(input) {
            var modalInstance = $uibModal.open({
                backdrop: false,
                component: 'khachHangDangKyGoiTap',
                resolve: {
                    khachHang: function () {
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

        function showModalKhachHangDetail(input) {
            var modalInstance = $uibModal.open({
                backdrop: false,
                component: 'khachHangDetail',
                resolve: {
                    khachHang: function () {
                        return { id: input.id };
                    }
                }
            });
        }

        function soNgayConLai(input) {
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

        function filterData() {
            getAll();
        }

    }
})();
