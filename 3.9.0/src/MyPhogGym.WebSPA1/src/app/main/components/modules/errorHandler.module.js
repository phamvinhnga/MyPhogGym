(function () {
    'use strict';

    angular
        .module('app.errorHander', ['app.logger'])
        .factory('errorHandler', errorHandler);

    /** @ngInject */
    function errorHandler(logger) {
        var factory = {
            handleValidationErrors: handleValidationErrors,
            handleAuthenticationErrors: handleAuthenticationErrors
        };

        return factory;

        /**
         * Add log and show message from error ajax object
         * @param {object} response: error object
         * @param {boolean} addLog: show log message
         * @param {Object} form: Object for set error state
         * @returns {string} message
         */
        function handleValidationErrors(response, showError, form) {
            var data, items, messages = [];
            
            showError = showError || false;

            try {
                data = response.data || response;
            }
            catch (e) {
                data = null;
            }

            if (!data) {
                return messages;
            }

            // check if validationErrors error
            if (form && data.validationErrors && angular.isArray(data.validationErrors)) {
                data.validationErrors.forEach(function (validationError) {
                    validationError.members.forEach(function (fieldName) {
                        if (form.hasOwnProperty(fieldName) && angular.isFunction(form[fieldName].$setValidity)) {
                            //TODO I dont know what error is, so set required error
                            // how set error message from server ?? validationError.message
                            form[fieldName].$setValidity('required', false);
                        }
                    });
                });
            }

            //get message from message or error_description property
            if (data.error)
                messages.push(data.error);
            else if (data.error_description)
                messages.push(data.error_description);
            else if (data.details)
                messages.push(data.details);
            else if (data.message)
                messages.push(data.message);
            else if (data.statusText)
                messages.push(data.statusText);
            else if (angular.isString(data))
                messages.push(data);

            // show log
            if (showError && messages.length > 0) {
                if (messages[0] == 'Invalid user name or password') {
                    messages[0] = document.getElementsByClassName("Invalid-user-name-or-password")[0].innerHTML;
                }
                else if (messages[0] == '[Current user did not login or exceed limit login]') {
                    messages[0] = document.getElementsByClassName("Current-user-did-not-login-or-exceed-limit-login")[0].innerHTML;
                }
                else if (messages[0] == 'EMAILUSERNOTVALID') {
                    messages[0] = document.getElementsByClassName("Email-user-not-valid")[0].innerHTML;
                }

                logger.logError(messages, data, true);
            }

            return messages;
        }

        /**
         * Add log and show message from error ajax object
         * @param response
         * @param addLog
         * @returns
         */
        function handleAuthenticationErrors(response, showError) {
            var data, messages = [];

            showError = showError || false;

            try {
                data = response.data || response;
            }
            catch (e) {
                data = null;
            }

            if (!data) {
                return messages;
            }

            //get message from message or error_description property
            if (data.error)
                messages.push(data.error);
            else if (data.error_description)
                messages.push(data.error_description);
            else if (data.details)
                messages.push(data.details);
            else if (data.message)
                messages.push(data.message);
            else if (data.statusText)
                messages.push(data.statusText);
            else if (angular.isString(data))
                messages.push(data);

            // show log
            if (showError && messages.length > 0) {
                if (messages[0] == 'Invalid user name or password') {
                    messages[0] = document.getElementsByClassName("Invalid-user-name-or-password")[0].innerHTML;
                }
                else if (messages[0] == '[Current user did not login or exceed limit login]') {
                    messages[0] = document.getElementsByClassName("message-login-invalid")[0].innerHTML;
                }
                else if (messages[0] == 'EMAILUSERNOTVALID') {
                    messages[0] = document.getElementsByClassName("Email-user-not-valid")[0].innerHTML;
                }

                logger.logError(messages, data, true);
            }

            return messages;
        }

        return factory;
    }
})();
