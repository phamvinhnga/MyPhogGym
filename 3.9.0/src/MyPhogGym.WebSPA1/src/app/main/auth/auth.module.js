(function () {
    'use strict';

    angular
        .module('app.auth', ['app.abp.oauth', 'app.errorHander', 'validation.match', 'ui.bootstrap.showErrors'])
        .provider('authConfig', authConfigProvider)
        .config(config)
        .run(run);

    /** @ngInject */
    function authConfigProvider(oauthServiceProvider) {
        // default config url for authentication
        var authConf = {
            oauthSettings: {
                site: 'http://localhost:6634',
                clientId: 'APP',
                clientSecret: 'TRENET-APP',
                paths: {
                    profileUri: 'api/services/app/userInfomation/getLoginUser'
                },
                session: {
                    storage: 'session'
                }
            }
        };

        /**
         * provider
         * @returns {type}
         */

        this.$get = function ($location, $state) {
            var service = {
                configuration: configuration,
                getSiteUrl: getSiteUrl,
                getResetPasswordUrl: getResetPasswordUrl
            };

            return service;

            /**
            *   get site url
            *   @returns {String} site url
            */
            function getSiteUrl() {
                var url = $location.protocol() + '://' + $location.host();
                if (($location.protocol() === 'https' && $location.port() === 443) ||
                    ($location.protocol() === 'http' && $location.port() === 80)) {
                    //nothing
                }
                else {
                    url = url + ':' + $location.port();
                }

                return url;
            }

            /**
            *   get site url
            *   @returns {String} site url
            */
            function getResetPasswordUrl() {
                var url = $state.href(authConf.defaultResetPassword, {}, { absolute: true })

                return url;
            }
        }

        /**
         * Configuration for oauth
         * @param {object} settings
         */
        this.setConfiguration = function (settings) {

            if (!angular.isObject(settings))
                return;

            angular.extend(authConf, settings);

            //update auth module
            oauthServiceProvider.setConfiguration(authConf.oauthSettings);
        }

        this.getConfiguration = function () {
            return authConf;
        }

        /**
         * return configuration
         * @returns {Object} ff
         */
        function configuration() {
            return authConf;
        }
    }

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, oauthServiceProvider, authConfigProvider, showErrorsConfigProvider) {
        $stateProvider
            .state('app.auth_login', {
                url: '/auth/login',
                views: {
                    'content@app': {
                        template: '<user-login></user-login>',
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app');

        oauthServiceProvider.setConfiguration(authConfigProvider.getConfiguration().oauthSettings);

        showErrorsConfigProvider.trigger('keypress');
    }

    /** @ngInject */
    function run($rootScope) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            $rootScope.returnState = null;
        });
    }
})();
