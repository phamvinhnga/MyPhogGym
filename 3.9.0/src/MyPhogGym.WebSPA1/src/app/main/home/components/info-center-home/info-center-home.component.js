(function () {
    'use strict';

    angular
        .module('app.home')
        .component('infoCenterHome', {
            templateUrl: 'app/main/home/components/info-center-home/info-center-home.html',
            controller: infoCenterHomeController,
            controllerAs: 'vm',
            bindings: {

            }
        });

    function infoCenterHomeController($q, $stateParams, getFileFactory, returnNameDiaChi, logger, errorHandler, abpApi, utilsService, $translate) {
        var vm = this;
        //===========================================================================================
        active();

        /**
         * active function
         */
        function active() {
            vm.loadForm = true;
            $q.all([
                getThongTinTrungTam(),
                getKhoaHocTrungTam()
            ]).then(function () {
                vm.loadForm = false;
            })

        }
        function getThongTinTrungTam() {
            var option = {
                criterias: [
                    {
                        propertyName: "Id",
                        operation: "Equals",
                        value: $stateParams.trungTamId
                    },
                ],
            }
            return abpApi.resolve('app.trungTam@getWithoutTenantAlls', option)
                .then(function (response) {
                    vm.thongTinTrungTam = response[0];
                    vm.thongTinTrungTam.imageFileUrl = getFileFactory.linkImage(vm.thongTinTrungTam.imageId);
                    _.each(vm.thongTinTrungTam.diaDiems, function (diaDiem) {
                        diaDiem.diaChi = returnNameDiaChi.convertValueToName(diaDiem.diaChi);
                    })
                })
        }
        function getKhoaHocTrungTam() {
            var option = {
                criterias: [
                    {
                        propertyName: "TrungTamId",
                        operation: "Equals",
                        value: $stateParams.trungTamId
                    },
                ],
                maxResultCount: 999
            }
            return abpApi.resolve('app.khoaHoc@getKhoaHocsConHieuLuc', option)
                .then(function (response) {
                    // handle địa điểm
                    _.each(response, function (khoaHoc) {
                        _.each(khoaHoc.diaDiemHocs, function (diaDiem) {
                            diaDiem.diaDiem.diaChi = returnNameDiaChi.convertValueToName(diaDiem.diaDiem.diaChi);
                        })
                    });
                    kiemTraThoiGianDangKy(response);
                    vm.khoaHocs = response;
                })
        }
        // kiểm tra có thể đăng ký được không
        function kiemTraThoiGianDangKy(khoaHocs) {
            var time = new Date();
            _.each(khoaHocs, function (khoaHoc) {
                var isCheck = false;
                _.each(khoaHoc.thoiGianDangKys, function (thoiGianDangKy) {
                    if ( new Date(thoiGianDangKy.thoiGianBatDau) <= time && time <= new Date(thoiGianDangKy.thoiGianKetThuc) )
                        {
                            isCheck = true;
                            return false;
                        }
                })
                khoaHoc._isDangKyHoc = isCheck;
            })
        }

    }
})();
