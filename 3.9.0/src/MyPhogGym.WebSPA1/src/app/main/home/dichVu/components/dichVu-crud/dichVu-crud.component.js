(function () {
    'use strict';

    angular
        .module('app.home')
        .component('dichVuCrud', {
            templateUrl: 'app/main/home/dichVu/components/dichVu-crud/dichVu-crud.html',
            controller: dichVuCurdController,
            controllerAs: 'vm',
            bindings: {
                modalInstance: "<",
                resolve: "<"
            },
    });

    function dichVuCurdController(logger, errorHandler, abpApi, $filter, valid) {
        var vm = this;

        // đối tượng
        vm.dichVu = {};
        vm.loaiGois = [
            {
                value: 1,
                text: 'Theo tháng'
            },
            {
                value: 2,
                text: 'Theo số lần quẹt thẻ'
            }
        ];
        vm.validation = valid;

        // methoad
        vm.get = getDichVu;
        vm.update = update;
        vm.isDelete = isDelete;
        vm.delete = deleteDichVu;
        vm.dismiss = dismiss;
        vm.confirmDelete = confirmDelete;
        vm.back = back;
        activate();

        // function
        function activate() {
        }

        function getDichVu() {
            var input = vm.resolve.dichVu;
            if (input.id != null) {
                return abpApi.resolve('app.dichVu@get', input)
                    .then(function (response) {
                        console.log(response);
                        vm.dichVu = response;
                        vm.dichVu.lichTap = angular.fromJson(response.lichTap);
                    });
            }
        }

        function update() {
            var callApi = vm.dichVu.id == null ? 'app.dichVu@create' : 'app.dichVu@update';
            vm.dichVu.lichTap = JSON.stringify(vm.dichVu.lichTap);
            return abpApi.resolve(callApi, vm.dichVu)
                .then(function (response) {
                    logger.logSuccess('Cập nhật thành công', null, true);
                    vm.modalInstance.close();
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }

        function dismiss() {
            vm.modalInstance.dismiss();
        }

        function isDelete() {
            return vm.dichVu.id == null ? false : true;
        }

        function deleteDichVu() {
            vm.isConfirm = true;
        }

        function back() {
            vm.isConfirm = false;
        }

        function confirmDelete(input) {
            return abpApi.resolve('app.dichVu@delete', { id: input.id })
                .then(function (response) {
                    logger.logSuccess('Xóa thành công', null, true);
                    vm.modalInstance.close();
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {
                });
        }
       
        function dismiss() {
            vm.modalInstance.dismiss();
        }

    }
})();
