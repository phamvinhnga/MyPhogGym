(function () {
    'use strict';

    angular
        .module('app.home')
        .component('caLamViecPage', {
            templateUrl: 'app/main/home/caLamViec/caLamViec.html',
            controller: caLamViecController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function caLamViecController(logger, errorHandler, abpApi, $uibModal) {

        var vm = this;

        //--- đối tướng
        vm.caLamViecs = [];

        //--- fitter
        vm.filter = {
            keySearch: null,
        };

        //--- phan trang
        vm.pagenation = {
            maxResultCount: 10,
            skipCount: 0,
            pageList: [],
            next: {},
            pre: {},
            indexPage: 0
        };

        //--- method
        vm.showModal = showModal;
        vm.filterData = filterData;

        activate();

        //--- function
        function activate() {
            getAll();
        }

        function getAll() {
            var input = {
                keySearch: vm.filter.keySearch,
                maxResultCount: 999
            };

            return abpApi.resolve('app.caLamViec@getAll', input)
                .then(function (response) {
                    vm.caLamViecs = response.items;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function showModal(input) {
            var modalInstance = $uibModal.open({
                component: 'caLamViecCrud',
                resolve: {
                    caLamViec: function () {
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

    }
})();
