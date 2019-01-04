(function () {
    'use strict';

    angular
        .module('app.logger', ['app.core', 'toastr'])
        .config(config)
        .factory('logger', logger);

    /** @ngInject */
    function config() {
    }

    /** @ngInject */
    function logger(toastr, $log) {
        var factory = {
            log: log,
            logSuccess: logSuccess,
            logError: logError,

            info: info,
            warn: warn,
            debug: debug
        };

        return factory;

        /**
         * log message with log system and show it with type info
         * @param {string} messages
         * @param {object} data
         * @param {boolean} showToast: whether show message
         * @returns
         */
        function log(messages, data, showToast) {
            logIt(messages, data, showToast, 'info');
        };
        /**
         * log message with log system and show it with type success
         * @param {string} messages
         * @param {object} data
         * @param {boolean} showToast: whether show message
         * @returns
         */
        function logSuccess(messages, data, showToast) {
            logIt(messages, data, showToast, 'success');
        };

        /**
        * wrapper info function of $log
        *
        */
        function info(object) {
            $log.info(object);
        };

        /**
       * wrapper warn function of $log
       *
       */
        function warn(object) {
            $log.warn(object);
        };

        /**
       * wrapper debug function of $log
       *
       */
        function debug(object) {
            $log.debug(object);
        };

        /**
         * log message with log system and show it with type error
         * @param {string} messages
         * @param {object} data
         * @param {boolean} showToast: whether show message
         * @returns
         */
        function logError(messages, data, showToast) {
            logIt(messages, data, showToast, 'error');
        };

        /**
         * log message with log system and show it
         * @param {string} messages
         * @param {object} data
         * @param {boolean} showToast: whether show message
         * @param {string} toastType: 'info', 'error', 'success'
         * @returns
         */

        function logIt(messages, data, showToast, toastType) {
            if (!angular.isArray(messages)) {
                messages = [messages];
            }

            var message = messages.join('<br />');

            //TODO fix for html content
            //message = message.replace(/(?:\r\n|\r|\n)/g, '<br />');

            //var template = '<md-toast md-theme="{{ toast.theme }}" ng-class="{\'md-capsule\': toast.capsule}">' +
            //'  <div class="md-toast-content">' +
            //'    <span flex role="alert" aria-relevant="all" aria-atomic="true">' +
            //'      {{ toast.content }}' +
            //'    </span>' +
            //'    <md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()" ng-class="{\'md-highlight\': toast.highlightAction}">' +
            //'      {{ toast.action }}' +
            //'    </md-button>' +
            //'  </div>' +
            //'</md-toast>';

            if (showToast) {
                if (toastType === 'error') {
                    toastr.error(message, "Error")
                } else {
                    if (toastType === 'success') {
                        toastr.success(message, "Success")
                    } else {
                        toastr.info(message, "Info");
                    }
                }
            }
        }
    }
})();