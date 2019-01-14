(function () {
    'use strict';

    angular
        .module('app.home')
        .component('lichLamViecCrud', {
            templateUrl: 'app/main/home/lichLamViec/components/lichLamViec-crud/lichLamViec-crud.html',
            controller: lichLamViecCrudController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
        });

    function lichLamViecCrudController(logger, errorHandler, abpApi, valid) {
        var vm = this;

        // -- cờ
        vm.validation = valid;
        vm.isConfirm = false;
        vm.validation = valid;
        vm.huanLuyenVienID = "";

        // -- doi tuong
        vm.lichLamViecHuanLuyenViens = [];
        vm.huanLuyenViens = [];

        // -- methoad
        vm.get = getLichLamViec;
        vm.update = update;
        vm.showButtonDelete = showButtonDelete;
        vm.isDelete = isDelete;
        vm.dismiss = dismiss;
        vm.confirmDelete = confirmDelete;
        activate();

        // -- function 
        function activate() { }

        function getLichLamViec() {
            vm.huanLuyenVienID = vm.resolve.lichLamViec.id;
            if (vm.huanLuyenVienID != null) {
                return abpApi.resolve('app.lichLamViec@getLichLamViecHuanLuyenVien', { id: vm.huanLuyenVienID })
                    .then(function (response) {
                        vm.lichLamViecHuanLuyenViens = response.lichLamViecs;
                        vm.huanLuyenViens = [{ id: response.id, hoTen: response.hoTen }];
                    });
            }
            getAllHuanLuyenVien();
            getAllCaLamViec();
        }

        function getAllCaLamViec() {
            return abpApi.resolve('app.lichLamViec@getAllCaLamViec')
                .then(function (response) {
                    angular.forEach(response, function (value, key) {
                        var lichLamViec = {
                            huanLuyenVienID: vm.huanLuyenVienID,
                            caLamViec: { tenCa: value.tenCa },
                            caLamViecID: value.id,
                            thuHai: false, thuBa: false, thuTu: false, thuNam: false, thuSau: false, thuBay: false, chuNhat: false,
                        };
                        vm.lichLamViecHuanLuyenViens.push(lichLamViec);
                    });
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function getAllHuanLuyenVien() {
            return abpApi.resolve('app.lichLamViec@getAllHuanLuyenVien')
                .then(function (response) {
                    vm.huanLuyenViens = response;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function update(input) {
            var callApi = vm.resolve.lichLamViec.id == null ? 'app.lichLamViec@create' : 'app.lichLamViec@update';
            angular.forEach(input, function (value, key) {
                value.huanLuyenVienID = vm.huanLuyenVienID;
                abpApi.resolve(callApi, value)
                    .then(function (response) {

                    })
                    .catch(function (error) {
                        errorHandler.handleValidationErrors(error, true);
                    });
            });
            vm.modalInstance.close();
            logger.logSuccess('Cập nhật thành công', null, true);
        }

        function showButtonDelete() {
            return vm.resolve.lichLamViec.id == null ? false : true;
        }

        function isDelete() {
            vm.isConfirm = !vm.isConfirm;
        }

        function confirmDelete(input) {
            angular.forEach(input, function (value, key) {
                abpApi.resolve('app.lichLamViec@delete', { id: value.id })
                    .then(function (response) {
                        logger.logSuccess('Xóa thành công', null, true);
                    })
                    .catch(function (error) {
                        errorHandler.handleValidationErrors(error, true);
                    })
                    .finally(function () {
                    });
            });
            vm.modalInstance.close();
        }

        function dismiss() {
            vm.modalInstance.dismiss();
        }
    }
})();

//(function () {
//    'use strict';

//    angular
//        .module('app.home')
//        .component('lichLamViecCrud', {
//            templateUrl: 'app/main/home/lichLamViec/components/lichLamViec-crud/lichLamViec-crud.html',
//            controller: lichLamViecCrudController,
//            controllerAs: 'vm',
//            bindings: {
//                modalInstance: "<",
//                resolve: "<"
//            },
//        });

//    function lichLamViecCrudController(logger, errorHandler, abpApi, valid) {
//        var vm = this;
//        // -- cờ
//        vm.isConfirm = false;
//        vm.validation = valid;

//        // -- doi tuong
//        vm.lichLamViec = {};
//        vm.huanLuyenViens = [];
//        vm.huanLuyenVienID;
//        vm.caLamViecs = [];

//        // -- methoad
//        vm.get = getLichLamViec;
//        vm.getAllHuanLuyenVien = getAllHuanLuyenVien;
//        vm.getAllCaLamViec = getAllCaLamViec;
//        vm.update = update;
//        vm.showButtonDelete = showButtonDelete;
//        vm.isDelete = isDelete;
//        vm.dismiss = dismiss;
//        vm.confirmDelete = confirmDelete;
//        activate();

//        // -- function 
//        function activate() {}

//        function getLichLamViec() {
//            var input = vm.resolve.lichLamViec;
//            if (input.id != null) {
//                return abpApi.resolve('app.lichLamViec@get', input)
//                    .then(function (response) {
//                        vm.lichLamViec = response;
//                        vm.huanLuyenViens = [
//                            {
//                                id: vm.lichLamViec.id_HLV,
//                                hoTen: vm.lichLamViec.huanLuyenVien.hoTen
//                            }
//                        ];
//                        vm.huanLuyenVienID = vm.huanLuyenViens[0];
//                        getAllCaLamViec();
//                    })
//                    .catch(function (error) {
//                        errorHandler.handleValidationErrors(error, true);
//                    })
//                    .finally(function () {
//                    });
//            }
//            getAllHuanLuyenVien(input);
//            getAllCaLamViec();
//        }

//        function getAllHuanLuyenVien(input) {
//            return abpApi.resolve('app.lichLamViec@getAllHuanLuyenVien', { id: input.id_HLV })
//                .then(function (response) {
//                    vm.huanLuyenViens = response;
//                })
//                .catch(function (error) {
//                    errorHandler.handleValidationErrors(error, true);
//                })
//                .finally(function () {
//                });
//        }

//        function getAllCaLamViec() {
//            return abpApi.resolve('app.lichLamViec@getAllCaLamViec')
//                .then(function (response) {
//                    var chiTiet = angular.fromJson(vm.lichLamViec.chiTiet);
//                    angular.forEach(response, function (valueLichLamViecAll, keyLichLamViecAll) {
//                        var obj = {
//                            tenCa: valueLichLamViecAll.tenCa,
//                            id: valueLichLamViecAll.id,
//                            days: { chuNhat: false,thuHai: false, thuBa: false, thuTu: false, thuNam: false, thuSau: false,thuBay: false, },
//                        };
//                        angular.forEach(chiTiet, function (valueLichHuanLuyenVien, keyLichHuanLuyenVien) {
//                            if (valueLichLamViecAll.id == valueLichHuanLuyenVien.id) {
//                                obj.days = valueLichHuanLuyenVien.days;
//                                return;
//                            }
//                        });
//                        vm.caLamViecs.push(obj);
//                    });
//                })
//                .catch(function (error) {
//                    errorHandler.handleValidationErrors(error, true);
//                })
//                .finally(function () {
//                });
//        }

//        function update() {
//            var callApi = vm.lichLamViec.id == null ? 'app.lichLamViec@create' : 'app.lichLamViec@update';
//            vm.lichLamViec.chiTiet = JSON.stringify(vm.caLamViecs);
//            vm.lichLamViec.id_HLV = vm.huanLuyenVienID.id;
//            return abpApi.resolve(callApi, vm.lichLamViec)
//                .then(function (response) {
//                    vm.modalInstance.close();
//                    logger.logSuccess('Cập nhật thành công', null, true);
//                })
//                .catch(function (error) {
//                    errorHandler.handleValidationErrors(error, true);
//                })
//                .finally(function () {
//                });
//        }

//        function showButtonDelete() {
//            return vm.lichLamViec.id == null ? false : true;
//        }

//        function isDelete() {
//            vm.isConfirm = !vm.isConfirm;
//        }

//        function confirmDelete(input) {
//            return abpApi.resolve('app.lichLamViec@delete', { id: input.id })
//                .then(function (response) {
//                    logger.logSuccess('Xóa thành công', null, true);
//                    vm.modalInstance.close();
//                })
//                .catch(function (error) {
//                    errorHandler.handleValidationErrors(error, true);
//                })
//                .finally(function () {
//                });
//        }

//        function dismiss() {
//            vm.modalInstance.dismiss();
//        }
//    }
//})();
