(function () {
    'use strict';

    angular
        .module('app.home')
        .component('huanLuyenVienPage', {
            templateUrl: 'app/main/home/huanLuyenVien/huanLuyenVien.html',
            controller: huanLuyenVienController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function huanLuyenVienController(logger, errorHandler, abpApi, $uibModal) {
        var vm = this;

        // -- đôi tượng
        vm.huanLuyenViens = [];

        // -- filter 
        vm.filter = {
            hopDong : '-1',
            trangThai: '-1',
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
        vm.showModal = showModal;
        vm.delete = deleteCaLamViec;
        vm.filterData = filterData;
        vm.loadEachPage = loadEachPage;

        activate()

        //--- function
        function activate() {
            getAll();
        }

        function getAll() {
            var input = {
                filterTrangThai: vm.filter.trangThai,
                filterHopDong: vm.filter.hopDong,
                keySearch: vm.filter.keySearch,
                skipCount: vm.pagenation.skipCount,
                maxResultCount: vm.pagenation.maxResultCount
            };

            return abpApi.resolve('app.huanLuyenVien@getAll', input)
                .then(function (response) {
                    console.log(response);
                    vm.huanLuyenViens = response.items;
                    renderPagenation(response.totalCount);
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
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
                component: 'huanLuyenVienCrud',
                resolve: {
                    huanLuyenVien: function () {
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

        function deleteCaLamViec(input) {
            return abpApi.resolve('app.huanLuyenVien@delete', { id: input.id })
                .then(function (response) {
                    logger.logSuccess('Xóa thành công', null, true);
                    setValueResultCountAndSkipCount(0, 0);
                    getAll();
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
