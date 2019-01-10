(function () {
    'use strict';

    angular
        .module('app.home')
        .component('lichLamViecPage', {
            templateUrl: 'app/main/home/lichLamViec/lichLamViec.html',
            controller: lichLamViecController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function lichLamViecController(logger, errorHandler, abpApi, $uibModal, valid) {
        var vm = this;

        //--- đối tướng
        vm.lichLamViecs = [];
        vm.validation = valid;

        // -- fitter
        vm.filter = {
            keySearch: null,
            trangThai: "-1",
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
        vm.showModal = showModal;
        vm.delete = deleteLichLamViec;
        vm.filterData = filterData;
        vm.loadEachPage = loadEachPage;
        vm.timKiemCaTheoNgay = timKiemCaTheoNgay;
        activate();

        //--- function
        function activate() {
            getAll();
        }

        function getAll() {
            var input = {
                keySearch: vm.filter.keySearch,
                filterTrangThai: vm.filter.trangThai,
                skipCount: vm.pagenation.skipCount,
                maxResultCount: vm.pagenation.maxResultCount
            };

            return abpApi.resolve('app.lichLamViec@getAll', input)
                .then(function (response) {
                    vm.lichLamViecs = response.items;
                    renderPagenation(response.totalCount);
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function timKiemCaTheoNgay(lichLamViec) {
            var chiTiet = angular.fromJson(lichLamViec.chiTiet);
            var filterDays = { thuHai: "", thuBa: "", thuTu: "", thuNam: "", thuSau: "", thuBay: "", chuNhat: "" };
            angular.forEach(chiTiet, function (caValue, key) {
                abpApi.resolve('app.caLamViec@get', { id: caValue.id })
                    .then(function (response) {
                        console.log(response);
                        if (response.trangThai) {
                            angular.forEach(caValue.days, function (dayValue, key) {
                                var ca = dayValue == true ? "- " + caValue.tenCa + "<br/>" : "";
                                switch (key) {
                                    case "thuHai":
                                        filterDays.thuHai += ca;
                                        break;
                                    case "thuBa":
                                        filterDays.thuBa += ca;
                                        break;
                                    case "thuTu":
                                        filterDays.thuTu += ca;
                                        break;
                                    case "thuNam":
                                        filterDays.thuNam += ca;
                                        break;
                                    case "thuSau":
                                        filterDays.thuSau += ca;
                                        break;
                                    case "thuBay":
                                        filterDays.thuBay += ca;
                                        break;
                                    case "chuNhat":
                                        filterDays.chuNhat += ca;
                                        break;
                                }
                            });
                        }
                    });
            });
            return filterDays;
        }

        function renderPagenation(totalCount) {

            var arr = [];
            var indexPage = vm.pagenation.indexPage;
            var maxResultCount = vm.pagenation.maxResultCount;

            var count = (totalCount % maxResultCount != 0) ? parseInt(totalCount / maxResultCount + 1) : totalCount / maxResultCount;

            vm.pagenation.next = {
                "pageNumber": indexPage + 1,
                "skipCount": (indexPage + 1) * maxResultCount,
                "active": (indexPage + 1 >= count) ? "disabled" : "",
                "isDisabled": (indexPage + 1 >= count) ? true : false,
                "show": true
            };
            vm.pagenation.pre = {
                "pageNumber": indexPage - 1,
                "skipCount": (indexPage - 1) * maxResultCount,
                "active": (indexPage - 1 < 0) ? "disabled" : "",
                "isDisabled": (indexPage - 1 < 0) ? true : false,
                "show": true
            };

            for (var i = 0; i < count; i++) {
                arr.push(
                    {
                        "pageNumber": i,
                        "skipCount": i * maxResultCount,
                        "active": i == indexPage ? "active" : "",
                        "isDisabled": i == indexPage ? true : false,
                    }
                );
            }
            vm.pagenation.pageList = arr;
        }

        function showModal(input) {
            var modalInstance = $uibModal.open({
                backdrop: false,
                component: 'lichLamViecCrud',
                resolve: {
                    lichLamViec: function () {
                        return { id: input.id };
                    }
                }
            });

            modalInstance.rendered.then(function () {
            });

            modalInstance.result.then(function () {
                setValueResultCountAndSkipCount(0, 0);
                getAll();
            });
        }

        function deleteLichLamViec(input) {
            return abpApi.resolve('app.lichLamViec@delete', { id: input.id })
                .then(function (response) {
                    setValueResultCountAndSkipCount(0, 0);
                    getAll();
                    logger.logSuccess('Xóa thành công', null, true);
                }).catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function filterData() {
            setValueResultCountAndSkipCount(0, 0);
            getAll();
        }

        function loadEachPage(skip, active, isDisabled) {
            if (!isDisabled) {
                setValueResultCountAndSkipCount(active, skip);
                getAll();
            }
        }

        function setValueResultCountAndSkipCount(indexPage, skipCount) {
            vm.pagenation.indexPage = indexPage;
            vm.pagenation.skipCount = skipCount;
        }
    }
})();
