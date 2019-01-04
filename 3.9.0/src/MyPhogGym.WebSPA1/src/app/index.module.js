(function () {
    'use strict';

    /**
     * Main module of the xyz
     */
    angular
        .module('xyz', [

            'app.core',

            'oc.lazyLoad',

            'app.themes',

            'theme.xyz',

            'app.auth',

            'app.utils',

            'app.home',

            'ui.bootstrap',

        ]);
})();
