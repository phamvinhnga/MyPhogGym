(function () {
    'use strict';

    angular
        .module('xyz')
        .component("webHeader", {
            templateUrl: 'app/main/infos/components/web-header/web-header.html',
            controller: webHeaderController,
            controllerAs: "vm",
            bindings: {}
        });

    /** @ngInject */
    function webHeaderController($rootScope, $state) {
        var vm = this;
        vm.loading = false;

        vm.applicationName = "HỆ THỐNG QUẢN LÝ GIÁO DỤC";

        vm.settings = { layoutPath: 'app/themes/xyz/assets' };

        vm.menus = [

            //{ name: 'Khách hàng', url: 'app.home.khach-hang-page', iconCss: 'fa fa-users', isActive: false, permissions: [] },

            {
                name: 'Khách hàng', url: '', iconCss: 'fa fa-users', isActive: false, children: [
                    { name: 'Quản Lý Khách Hàng', url: 'app.home.quan-ly-khach-hang-page', isActive: false },
                    { name: 'Khánh Hàng Đến Tập', url: 'app.home.khach-hang-den-tap-page', isActive: false },
                ]
            },

            { name: 'Dịch vụ', url: 'app.home.dich-vu-page', iconCss: 'fa fa-bars', isActive: false, permissions: [] },

            { name: 'Huấn luyện viên', url: 'app.home.huan-luyen-vien-page', iconCss: 'fa fa-user', isActive: false, permissions: [] },

            { name: 'Ca làm việc', url: 'app.home.ca-lam-viec-page', iconCss: 'fa fa-bitbucket', isActive: false, permissions: [] },

            { name: 'Lịch làm việc', url: 'app.home.lich-lam-viec-page', iconCss: 'glyphicon glyphicon-equalizer', isActive: false, permissions: [] },
        ];

        //===========================================================================================

        activate();

        /**
         * active function
         */
        function activate() {
            activeMenu($state.current.name);

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    var found = _.find(vm.menus, { isActive: true });
                    if (found != null) {
                        found.isActive = false;
                        if (found.children != null) {
                            var found = _.find(found.children, { isActive: true });
                            if (found != null) {
                                found.isActive = false;
                            }
                        }
                    }

                    activeMenu(toState.name);
                })
        };

        function activeMenu(url) {
            _.each(vm.menus, function (menu) {

                menu.url = menu.url != null ? menu.url : '';

                var check = menu.url == url;
                if (check == true) {
                    menu.isActive = true;
                }
                else {
                    _.each(menu.children, function (child) {
                        check = child.url == url;
                        if (check == true) {
                            menu.isActive = true;
                            child.isActive = true;
                        }
                    });
                }
            });
        }
    }
})();
