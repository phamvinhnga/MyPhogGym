(function () {
    'use strict';

    angular
        .module('app.home')
        .component('dichVuPage', {
            templateUrl: 'app/main/home/dichVu/dichVu.html',
            controller: dichVuController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<"
            }
        });

    function dichVuController(logger, errorHandler, abpApi, $uibModal) {
        var vm = this;

        //--- đối tướng
        vm.dichVus = [];

        // filter
        vm.filter = {
            keySearch: null,
        };

        //--- methoad
        vm.filterData = filterData;
        vm.showModal = showModal;
        activate();

        //-- function
        function activate() {
            getAll();
        }

        function getAll() {
            var input = {
                maxResultCount: 999,
                keySearch: vm.filter.keySearch
            };

            return abpApi.resolve('app.dichVu@getAll', input)
                .then(function (response) {
                    vm.dichVus = response.items;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function showModal(input) {
            var modalInstance = $uibModal.open({
                component: 'dichVuCrud',
                resolve: {
                    dichVu: function () {
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
