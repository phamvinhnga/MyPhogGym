(function () {
    'use strict';

    angular
        .module('theme.xyz', [
            'app.core',

            'MetronicApp',
        ])
        .config(config)
        .run(runBlock);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider) {
        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'main@': {
                        template: '<div class="app-container" ui-view="content"></div>'
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app');
    }

    /** @ngInject */
    function runBlock() {
    }
})();
