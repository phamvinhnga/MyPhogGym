(function () {
    'use strict';

    angular
        .module('xyz')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, abpAuthService, $ocLazyLoad, APPCONF, $translate, storageService) {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        // redirect after logout
        var logoutEvent = $rootScope.$on('oauth:logout', function () {
            $rootScope.currentUser = null;
            $state.go('app.home', {}, { reload: true });
        });

        var userProfile = $rootScope.$on('oauth:profile', function (event, profile) {
            $rootScope.currentUser = profile;
        });


        var language = storageService.getCookie('Abp.Localization.CultureName');
        if (language) {
            $translate.use(language.name  || language);
        }

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
            logoutEvent();
            userProfile();
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;


    }

    //bootstrap app
    angular.element(function () {
        angular.bootstrap(document, ['xyz']);
    })
})();
