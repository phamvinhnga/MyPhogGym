(function () {
    'use strict';

    angular
        .module('app.home')
        .component('khachHangDenTapPage', {
            templateUrl: 'app/main/home/khachHang/khachHangDenTap/khachHangDenTap.html',
            controller: khachHangDenTapController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function khachHangDenTapController(logger, errorHandler, abpApi, $uibModal, $interval) {
        var vm = this;
        // -- đôi tượng
        vm.khachHangs = [];
        vm.quetThe = null;
  
        // -- filter 
        vm.filter = {
            trangThai: "-1",
            keySearch: null,
        };

        vm.thoiGianConLai = thoiGianConLai
        vm.khachHangQuetThe = khachHangQuetThe;
        vm.filterData = filterData;
        vm.soNgayConLai = soNgayConLai

        // -- activate function
        activate()

        // -- function
        function activate() {
            getAll();
        }

        function getAll() {
            vm.stt = 0;
            var input = {
                keySearch: vm.filter.keySearch,
                maxResultCount: 999
            };

            return abpApi.resolve('app.khachHangDenTap@getAll', input)
                .then(function (response) {
                    vm.khachHangs = response.items;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function filterData() {
            getAll();
        }

        function thoiGianConLai(timeE) {
            var time = moment(timeE, 'HH:mm:ss');
            return moment(time).diff(moment(), 'minutes');
        }

        function khachHangQuetThe(input) {
            return abpApi.resolve('app.khachHangDenTap@khachHangQuetThe', { id: input })
                .then(function (response) {
                    getAll();
                    debugger
                    if (response == "SUCCESS") {
                        logger.logSuccess('Thành công', null, true);
                    }
                    else {
                        if (response == "KTBT") {
                            logger.logSuccess("Kết thúc buổi tập",null, true);
                        }
                        else {
                            errorHandler.handleValidationErrors(response, true);
                        }
                    }
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        $interval(activate, 150000);

        function soNgayConLai(input, khachHang) {
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

    }
})();
