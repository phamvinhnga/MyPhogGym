(function () {
    'use strict';

    angular
        .module('app.sso', ['app.core', 'angular-ladda', 'validation.match', 'ui.bootstrap', 'ui.bootstrap.showErrors', 'naif.base64', 'summernote', 'ngTagsInput', , 'ui.bootstrap'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.sso', {
                url: '/sso',
                // abstract: true,
                views: {
                    'content@app': {
                        template: '<sso></sso>',
                    }
                },

            })
            .state('app.sso.login-edu', {
                url: '/login',
                views: {
                    'content@app': {
                        template: '<login-edu></login-edu>',
                    }
                },
                bodyClass: 'auth-login login',
            })
            .state('app.sso.register-edu', {
                url: '/register',
                views: {
                    'content@app': {
                        template: '<register-edu></register-edu>',
                    }
                },
                bodyClass: 'register',
            })
            .state('app.sso.register-center-edu', {
                url: '/register-center',
                views: {
                    'content@app': {
                        template: '<register-center-edu></register-center-edu>',
                    }
                },
                bodyClass: 'auth-register-center',
            })
            .state('app.sso.register-orther-edu', {
                url: '/register-order/:orderUser',
                views: {
                    'content@app': {
                        template: '<register-orther-edu></register-orther-edu>',
                    }
                },
                bodyClass: 'auth-register-other',
            })
            .state('app.sso.add-center-edu', {
                url: '/add-center',
                views: {
                    'content@app': {
                        template: '<add-center-edu></add-center-edu>',
                    }
                },
                bodyClass: 'auth-add-center',
            })
            .state('app.sso.join-organization', {
                url: '/join-organization/:tenant',
                views: {
                    'content@app': {
                        template: '<join-organization></join-organization>',
                    }
                },
                bodyClass: 'auth-add-center',
            })
            ;

        // Translation
        $translatePartialLoaderProvider.addPart('app');
    }
})();
