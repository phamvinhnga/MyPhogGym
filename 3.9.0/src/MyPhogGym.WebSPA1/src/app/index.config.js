(function () {
    'use strict';

    angular
        .module('xyz')
        .config(config);

    /** @ngInject */
    function config($translateProvider, authConfigProvider, abpApiProvider, APPCONF) {
        //set default return url for login
        authConfigProvider.setConfiguration({
            oauthSettings: {
                site: APPCONF.authUrl
            }
        });

        //set base url for api
        abpApiProvider.setBaseUrl(APPCONF.baseUrl);

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
})();
