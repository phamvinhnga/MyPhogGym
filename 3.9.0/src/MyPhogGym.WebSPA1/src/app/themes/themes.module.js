﻿(function () {
    'use strict';

    angular
        .module('app.themes', [
        ])
        .service('appTheming', appThemingService)
        .config(config)
        .run(runBlock);

    /** @ngInject */
    function appThemingService($cookies, $log) {
        var service = {
            setActiveTheme: setActiveTheme,
            setThemesList: setThemesList,
            themes: {
                list: {},
                active: {
                    'name': '',
                    'theme': {}
                }
            }
        };

        return service;

        //////////

        /**
         * Set active theme
         *
         * @param themeName
         */
        function setActiveTheme(themeName) {
            // If theme does not exist, fallback to the default theme
            if (angular.isUndefined(service.themes.list[themeName])) {
                // If there is no theme called "default"...
                if (angular.isUndefined(service.themes.list.default)) {
                    $log.error('You must have at least one theme named "default"');
                    return;
                }

                $log.warn('The theme "' + themeName + '" does not exist! Falling back to the "default" theme.');

                // Otherwise set theme to default theme
                service.themes.active.name = 'default';
                service.themes.active.theme = service.themes.list.default;
                $cookies.put('selectedTheme', service.themes.active.name);

                return;
            }

            service.themes.active.name = themeName;
            service.themes.active.theme = service.themes.list[themeName];
            $cookies.put('selectedTheme', themeName);
        }

        /**
         * Set available themes list
         *
         * @param themeList
         */
        function setThemesList(themeList) {
            service.themes.list = themeList;
        }
    }

    /** @ngInject */
    function config() {
        /*eslint-disable */

        /*eslint-enable */
    }

    /** @ngInject */
    function runBlock() {
    }
})();