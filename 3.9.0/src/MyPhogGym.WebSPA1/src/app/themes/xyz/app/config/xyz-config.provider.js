(function () {
    'use strict';

    angular
        .module('theme.xyz')
        .provider('xyzConfig', xyzConfigProvider);

    /** @ngInject */
    function xyzConfigProvider() {
        // Default configuration
        var xyzConfiguration = {
            'disableCustomScrollbars': false,
            'disableCustomScrollbarsOnMobile': true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration) {
            xyzConfiguration = angular.extend({}, xyzConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function () {
            var service = {
                getConfig: getConfig,
                setConfig: setConfig
            };

            return service;

            //////////

            /**
             * Returns a config value
             */
            function getConfig(configName) {
                if (angular.isUndefined(xyzConfiguration[configName])) {
                    return false;
                }

                return xyzConfiguration[configName];
            }

            /**
             * Creates or updates config object
             *
             * @param configName
             * @param configValue
             */
            function setConfig(configName, configValue) {
                xyzConfiguration[configName] = configValue;
            }
        };
    }
})();
