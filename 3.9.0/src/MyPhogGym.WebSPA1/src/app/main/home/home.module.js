(function () {
    'use strict';

    angular
        .module('app.home', ['app.core', 'moment-picker', 'app.valid'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, $qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
        // State
        $stateProvider
            .state('app.home', {
                url: '/home',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/home/home.html',
                        controller: 'HomeController as vm'
                    }
                },
            })
            .state('app.home.home-page', {
                url: '/home-page',
                template: '<home-page></home-page>'
            })
            .state('app.home.info-center-home', {
                url: '/info-center-home/:trungTamId',
                template: '<info-center-home></info-center-home>'
            })
            .state('app.home.student-register-course-home', {
                url: '/student-register-course-home/:khoaHocId',
                template: '<student-register-course-home></student-register-course-home>'
            })
            .state('app.home.dich-vu-page', {
                url: '/dich-vu',
                template: '<dich-vu-page></dich-vu-page>'
            })
            .state('app.home.huan-luyen-vien-page', {
                url: '/huan-luyen-vien',
                template: '<huan-luyen-vien-page></huan-luyen-vien-page>'
            })
            .state('app.home.ca-lam-viec-page', {
                url: '/ca-lam-viec',
                template: '<ca-lam-viec-page></ca-lam-viec-page>'
            })
            .state('app.home.lich-lam-viec-page', {
                url: '/lich-lam-viec',
                template: '<lich-lam-viec-page></lich-lam-viec-page>'
            })
            .state('app.home.khach-hang-page', {
                url: '/khach-hang',
                template: '<khach-hang-page></khach-hang-page>'
            })
               // },
                //data: {
                //    authorize: true,
                //    roles: [],
                //    permissions: ['Admin.Users', 'Admin.Cms', 'Admin.Customers', 'Admin.Prices']
                //}
            //})
            ;


        // Translation
        $translatePartialLoaderProvider.addPart('app');
    }
})();
