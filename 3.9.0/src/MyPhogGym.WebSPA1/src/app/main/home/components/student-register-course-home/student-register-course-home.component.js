(function () {
    'use strict';

    angular
        .module('app.home')
        .component('studentRegisterCourseHome', {
            templateUrl: 'app/main/home/components/student-register-course-home/student-register-course-home.html',
            controller: studentRegisterCourseHomeController,
            controllerAs: 'vm',
            bindings: {
            }
        });

    function studentRegisterCourseHomeController($stateParams, $scope, $q, redirectFormFactory, $uibModal, setCheckBox, getFileFactory, returnNameDiaChi, requiredFactory, storageService, logger, errorHandler, abpApi, calculateTime, mapDataDtoFactory, $translate) {
        var vm = this;

        vm.vaiTros = [
            { value: "HocVien", name: 'Học viên' },
            { value: "PhuHuynh", name: 'Phụ huynh' }
        ];

        vm.parents = [{}];

        var userInfo = storageService.getUserInfo();

        if (userInfo) {
            vm.userInfo = {
                hoTenDem: userInfo.surname,
                ten: userInfo.name,
                email: userInfo.emailAddress,
                userId: userInfo.id
            }
        }
        vm.isUserInfor = userInfo !== null;
        vm.requiredFactory = requiredFactory;



        //===========================================================================================
        vm.setCheckboxAll = setCheckboxAll;
        vm.setCheckboxChild = setCheckboxChild;

        vm.addParent = addParent;
        vm.deleteParent = deleteParent;

        vm.checkUserName = checkUserName;
        vm.saveObj = saveObj;
        active();

        /**
         * active function
         */
        function active() {
            init();
        }

        function init() {
            vm.loadForm = true;
            getKhoaHoc()
                .then(function () {
                    getDanhMuc();
                    if (userInfo !== null) {
                        getThongTinHocVien()
                            .then(function (thongTinHocViens) {
                                if (thongTinHocViens.length == 0) {
                                    getHocVien();
                                }
                                else {
                                    vm.userInfo = thongTinHocViens[0];
                                    getThongTinMoiQuanHe(vm.userInfo.id);
                                    getDangKyHoc(vm.userInfo.id);
                                }

                            })
                    };
                })
                .finally(function () {
                    vm.loadForm = false;
                })
        }

        function getKhoaHoc() {
            var option = {
                "criterias": [
                    {
                        "propertyName": "id",
                        "operation": "Equals",
                        "value": $stateParams.khoaHocId
                    }
                ],
            }
            return abpApi.resolve('app.khoaHoc@getKhoaHocsConHieuLuc', option)
                .then(function (response) {
                    vm.khoaHoc = response[0];
                    if (vm.khoaHoc.trungTam && vm.khoaHoc.trungTam.imageId)
                        vm.khoaHoc.trungTam.imageFileUrl = getFileFactory.linkImage(vm.khoaHoc.trungTam.imageId);
                    _.each(vm.khoaHoc.diaDiemHocs, function (diaDiem) {
                        diaDiem.diaDiem.diaChi = returnNameDiaChi.convertValueToName(diaDiem.diaDiem.diaChi);
                    });
                    _.each(vm.khoaHoc.trungTam.diaDiems, function (diaDiem) {
                        diaDiem.diaChi = returnNameDiaChi.convertValueToName(diaDiem.diaChi);
                    });
                    return vm.khoaHoc;
                })
                .catch(function (error) {
                    errorHandler.handleValidationErrors(error, true);
                })
                .finally(function () {

                });

        }

        function getThongTinHocVien() {
            var option = {
                criterias: [{
                    propertyName: 'userId',
                    operation: 'Equals',
                    value: vm.userInfo.userId
                },
                {
                    propertyName: 'TrungTamId',
                    operation: 'Equals',
                    value: vm.khoaHoc.trungTamId
                }]
            }
            return abpApi.resolve('app.thongTinHocVien@getWithoutTenantAlls', option)
                .then(function (response) {
                    return response;
                })
        }

        function getThongTinMoiQuanHe(thongTinHocVienId) {
            var option = {
                criterias: [
                    {
                        propertyName: "ThongTinHocVienId",
                        operation: "Equals",
                        value: thongTinHocVienId
                    }
                ]
            }
            return abpApi.resolve('app.thongTinMoiQuanHe@getWithoutTenantAlls', option)
                .then(function (response) {
                    vm.parents = [];
                    vm.thongTinMoiQuanHes = response;
                    _.each(response, function (thongTinPhuHuynh) {
                        thongTinPhuHuynh.phuHuynh.loaiQuanHeId = thongTinPhuHuynh.loaiQuanHeId;
                        vm.parents.push(thongTinPhuHuynh.phuHuynh);
                    })

                })
        }

        function getDangKyHoc(thongTinHocVienId) {
            var option = {
                criterias: [{
                    propertyName: "ThongTinHocVienId",
                    operation: "Equals",
                    value: thongTinHocVienId
                }]
            }
            return abpApi.resolve('app.dangKyHoc@getWithoutTenantAlls', option)
                .then(function (response) {
                    vm.dangKyHocs = response;
                    setCheckboxInit(response);
                })
        }

        // set checkbox khi khởi tạo
        function setCheckboxInit(danhKyHocs) {
            _.each(vm.khoaHoc.diaDiemHocs, function (diaDiemHoc) {
                _.each(diaDiemHoc.lopDoiTuongs, function (lopDoiTuong) {
                    _.each(danhKyHocs, function (dangKyHoc) {
                        var found = _.find(dangKyHoc.dangKyChiTiets, function (dangKyHocChiTiet) {
                            return dangKyHocChiTiet.lopDoiTuongId == lopDoiTuong.id;
                        })
                        if (found) lopDoiTuong.checkbox = true;
                    });
                })
            })
            checkCheckboxAll();
        }

        function getHocVien() {

            var option = {
                criterias: [{
                    propertyName: 'userId',
                    operation: 'Equals',
                    value: vm.userInfo.userId
                }]
            }
            return abpApi.resolve('app.hocVien@getWithoutTenantAlls', option)
                .then(function (response) {
                    if (response.length > 0) {
                        vm.userInfo = response[0];
                        vm.userInfo.hocVienId = vm.userInfo.id;
                        delete vm.userInfo.id;
                    }
                    return response;
                })
        }

        function getDanhMuc() {
            var option = {
                criterias: [
                    {
                        propertyName: "Nhom",
                        operation: "Equals",
                        value: "MOIQUANHE"
                    },
                    {
                        propertyName: "TrungTamId",
                        operatuin: "Equals",
                        value: vm.khoaHoc.trungTamId
                    }]
            }
            return abpApi.resolve('app.danhMuc@getWithoutTenantAlls', option)
                .then(function (response) {
                    vm.danhMucs = response;
                })

        }

        function setCheckboxAll() {
            _.each(vm.khoaHoc.diaDiemHocs, function (diaDiemHoc) {
                setCheckBox.checkAllChild(vm.checkboxAll, diaDiemHoc.lopDoiTuongs)
            })
        }

        function setCheckboxChild(value) {
            if (!value) {
                vm.checkboxAll = value;
                checkEnableSubmit();
                return;
            }
            checkCheckboxAll();
        }

        function checkCheckboxAll() {
            _.each(vm.khoaHoc.diaDiemHocs, function (diaDiemHoc) {
                if (!setCheckBox.checkAll(diaDiemHoc.lopDoiTuongs)) {
                    vm.checkboxAll = false;
                    return false;
                }
                else vm.checkboxAll = true;
            })

            checkEnableSubmit();

        }
        // kiểm tra có tồn tại checkbox không để enable btn đăng ký
        function checkEnableSubmit() {
            
            if (vm.checkboxAll) vm.enableSubmit = true;
            else {
                vm.enableSubmit = false;
                _.each(vm.khoaHoc.diaDiemHocs, function (diaDiemHoc) {
                    if (setCheckBox.checkCheckbox(diaDiemHoc.lopDoiTuongs)) {
                        vm.enableSubmit = true;
                        return false;
                    }
                })
            }
        }

        function saveObj(form) {
            if (form.$invalid) return;
            debugger
            // xóa các phụ huynh còn trống
            _.remove(vm.parents, function (parent) {
                return !parent.hoTenDem && !parent.ten && !parent.email && !parent.passwordConfirm && !parent.password;
            });

            // tạo user : hoc vien  && phu huynh
            createUsers()
                .then(function () {
                    createDangKyHoc();
                })
        }

        function createDangKyHoc() {
            vm.userInfo.trungTamId = vm.khoaHoc.trungTam.id;
            vm.userInfo.tenantId = vm.khoaHoc.trungTam.tenantId;
            var dangKyHoc = {
                tenantId: vm.khoaHoc.trungTam.tenantId,
                thoiGianDangKyId: calculateTime.getThoiGianDangKyId(vm.khoaHoc.thoiGianDangKys),
                hocVien: vm.userInfo,
                phuHuynhs: vm.parents,
                dangKyChiTiets: []
            };
            if (vm.dangKyHocs && vm.dangKyHocs.length > 0) {
                dangKyHoc.id = _.first(vm.dangKyHocs).id;
            }
            var lopDoiTuongs = [];
            _.each(vm.khoaHoc.diaDiemHocs, function (diaDiemHoc) {
                lopDoiTuongs = _.concat(lopDoiTuongs, _.filter(diaDiemHoc.lopDoiTuongs, { 'checkbox': true }));
            });
            _.each(lopDoiTuongs, function (lopDoiTuong) {
                dangKyHoc.dangKyChiTiets.push({ lopDoiTuongId: lopDoiTuong.id })
            });
            return abpApi.resolve('app.dangKyHoc@createInHome', dangKyHoc)
                .then(function (response) {
                    openModalSuccess(response);
                })
        }

        // tạo user
        function createUsers() {
            var promises = [];
            // kiểm user đã có chưa nếu chưa có thêm vào tạo mới user
            if (!userInfo) {
                var user = mapDataDtoFactory.userEduToSso(vm.userInfo); // map dữ liệu sang sso
                user = _.assignIn(vm.userInfo, user);
                promises.push(redirectFormFactory.currentResolve('api/register/registerUser', user))
            }

            // lấy danh phụ huynh chưa tạo
            var parentCreateUser = _.reject(vm.parents, function (parent) { return parent.userId });

            _.each(parentCreateUser, function (parent) {
                var user = mapDataDtoFactory.userEduToSso(parent); // map dữ liệu sang sso
                user = _.assignIn(parent, user);
                promises.push(redirectFormFactory.currentResolve('api/register/registerUser', user));
            });
            return $q.all(promises)
                .then(function (response) {
                    if (!userInfo) {
                        vm.userInfo.userId = response[0].userId; // gán user id cho học viên
                    }
                    if ((userInfo && response.length > 0) || (!userInfo && response.length > 1)) {
                        var space = userInfo ? 0 : 1; // kiểm tra nếu userInfo chưa có thì bắt đầu từ 0 nếu có r thì bắt đầu từ 1
                        for (var i = space; i < response.length; i++) {
                            parentCreateUser[i - space].userId = response[i].userId; // gán user id cho phụ huynh
                        }
                    }
                    return response;
                })
                .catch(function (error) {
                    errorHandler.handleAuthenticationErrors(error, true);
                })
                .finally(function () {

                })
        }

        function openModalSuccess(dangKyHoc) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                component: 'infoRegisterHome',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'newsfrontend',
                size: 'md',
                resolve: {
                    dangKyHoc: function () {
                        return dangKyHoc;
                    }
                }
            });
            return modalInstance.result
                .then(function (response) {
                    if (response) {

                        if (response.id && response.isDeleted) {
                            deleteCategory(response.id);
                        } else if (!response.id) {
                            newCategory(response);
                        }
                        else if (response.id) {
                            updateCategory(response);
                        }
                    }
                });
        }

        function checkUserName(data, ev) {
            if (!data) return;
            return redirectFormFactory.resolve('api/services/app/registration/CheckRegisterUser', { email: data })
                .then(function (res) {
                    if (!res.canLogin) {
                        errorHandler.handleValidationErrors("Mail Đăng Ký Đã Tồn Tại", true);
                        $(ev.target).focus();
                    }
                    else {
                        vm.isCreateTenant = false
                    };
                })
                .catch(function (error) {
                    errorHandler.handleAuthenticationErrors(error, true);
                })
                .finally(function () {

                })

        }

        function addParent() {
            var lastParent = _.last(vm.parents);
            if (lastParent.hoTenDem || lastParent.ten || lastParent.dienThoai || lastParent.email || lastParent.passwordConfirm || lastParent.password) {
                vm.parents.push({});
            }
        }
        function deleteParent(index) {
            if (vm.parents[index].id) {
                deleteThongTinMoiQuanHe(index);
            }
            else
                vm.parents.splice(index, 1);
        }

        function deleteThongTinMoiQuanHe(index) {

            var found = _.find(vm.thongTinMoiQuanHes, { 'thongTinPhuHuynhId': vm.parents[index].id });
            if (found) {
                return abpApi.resolve('app.thongTinMoiQuanHe@delete', { id: found.id })
                    .then(function () {
                        logger.logSuccess('Xóa Thành Công', null, true);
                        vm.parents.splice(index, 1);
                    })
            }
        }

        var requiredParent = $scope.$watch('vm.parents', function (newVal, oldVal) {

            //lấy ra danh sách parent chưa bật cờ bắt lỗi
            var listParentChange = _.filter(newVal, function (parent) { return !parent.isRequired; });

            _.each(listParentChange, function (parent) {
                if (parent.hoTenDem || parent.ten || parent.dienThoai || parent.email || parent.passwordConfirm || parent.password)
                    parent._isRequired = true;
                else parent._isRequired = false;
            });

        }, true);

        $scope.$on("$destroy", function () {
            requiredParent();
        });
    }
})();
