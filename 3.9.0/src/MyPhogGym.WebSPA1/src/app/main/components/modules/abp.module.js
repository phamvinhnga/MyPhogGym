(function (abp, angular) {
    'use strict';

    /**
    * This is wrapper abp javascript
    * Require abp script is loaded before
    */

    if (!angular) {
        return;
    }

    angular
        .module('app.abp', ['abp'])
        .constant('abp', abp)
        .constant('abpAjax', abp.ajax)
        .constant('abpNotify', abp.notify)
        .constant('abpUI', abp.ui)
        .constant('abpEvent', abp.event)
        .constant('abpLog', abp.log)
        .constant('abpUtils', abp.utils)
        .constant('abpMessage', abp.message)
        .constant('abpLocalization', abp.localization)
        .constant('abpAuth', abp.auth)
        .constant('abpSession', abp.session)
        .provider('abpApi', abpApiProvider);

    /** @ngInject **/
    function abpApiProvider(abp) {
        /* ----------------- */
        /* Provider          */
        /* ----------------- */
        var provider = this;

        // Inject required services
        var $log = angular.injector(['ng']).get('$log');

        // Data
        var baseUrl = '';
        var api = [];

        // Methods
        provider.setBaseUrl = setBaseUrl;
        provider.getBaseUrl = getBaseUrl;
        provider.getApiObject = getApiObject;
        provider.register = register;

        //////////

        /**
         * Set base url for API endpoints
         *
         * @param url {string}
         */
        function setBaseUrl(url) {
            // set path for abp service
            //set base for api service
            baseUrl = abp.appPath = url;
        }

        /**
         * Return the base url
         *
         * @returns {string}
         */
        function getBaseUrl() {
            return baseUrl;
        }

        /**
         * Return the api object
         *
         * @returns {object}
         */
        function getApiObject() {
            return api;
        }

        /**
         * Register API endpoint
         *
         * @param key
         * @param resource
         */
        function register(key, resource) {
            if (!angular.isString(key)) {
                $log.error('"path" must be a string (eg. `dashboard.project`)');
                return;
            }

            if (!angular.isArray(resource)) {
                $log.error('"resource" must be an array and it must follow $resource definition');
                return;
            }

            // Store the API object
            api[key] = {
                baseUrl: baseUrl,
                url: baseUrl + (resource[0] || ''),
                paramDefaults: resource[1] || [],
                actions: resource[2] || [],
                options: resource[3] || {}
            };
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */
        this.$get = function ($q, $log, $resource, $rootScope, $injector) {
            // Data

            // Methods
            var service = {
                setBaseUrl: setBaseUrl,
                getBaseUrl: getBaseUrl,
                register: register,
                resolve: resolve,
                request: request
            };

            return service;

            //////////

            /**
             * Resolve an API endpoint
             *
             * @param action {string}
             * @param parameters {object}
             * @returns {promise|boolean}
             */
            function resolve(action, parameters, httpParams) {
                // Emit an event
                $rootScope.$broadcast('abpApi::resolveStart');

                var actionParts = action.split('@'),
                    resource = actionParts[0],
                    method = actionParts[1],
                    params = parameters || {},
                    httpParams = angular.extend({}, { abpHandleError: false }, httpParams || {});

                // Create a new deferred object
                var deferred = $q.defer();

                if (!resource || !method) {
                    $log.error('abpApi.resolve requires correct action parameter (resourceName@methodName)');
                    deferred.reject('abpApi.resolve requires correct action parameter (resourceName@methodName)');
                }

                // Get the correct resource definition from api object
                var apiObject = findApiObject(resource);

                if (!apiObject) {
                    $log.error('Resource "' + resource + '" is not defined in the api service!');
                    deferred.reject('Resource "' + resource + '" is not defined in the api service!');
                }
                else {
                    if (angular.isFunction(apiObject[method])) {
                        // get $pormise if api is $resource
                        var promise = apiObject[method](params, httpParams);
                        if (promise.$promise) {
                            promise = promise.$promise;
                        }
                        promise.then(
                            // Success
                            function (response) {
                                if (response.data && (!httpParams.__requireXHR || httpParams.__requireXHR === false)) {
                                    // Resolve the promise
                                    deferred.resolve(response.data);
                                } else {
                                    deferred.resolve(response);
                                }

                                // Emit an event
                                $rootScope.$broadcast('abpApi::resolveSuccess');
                            },

                            // Error
                            function (response) {
                                if (response.responseJSON) {
                                    deferred.reject(response.responseJSON);
                                } else {
                                    deferred.reject(response);
                                }

                                // Emit an event
                                $rootScope.$broadcast('abpApi::resolveError');
                            }
                        );
                    } else {
                        $log.error('Resource "' + resource + '" with method "' + method + '" is not defined in the api service!');
                        deferred.reject('Resource "' + resource + '" with method "' + method + '" is not defined in the api service!');
                    }
                }

                // Return the promise
                return deferred.promise;
            }

            /**
             * Make a request to an API endpoint
             *
             * @param action {string}
             * @param [parameters] {object}
             * @param [success] {function}
             * @param [error] {function}
             *
             * @returns {promise|boolean}
             */
            function request(action, parameters, success, error) {
                // Emit an event
                $rootScope.$broadcast('abpApi::requestStart');

                var actionParts = action.split('@'),
                    resource = actionParts[0],
                    method = actionParts[1],
                    params = parameters || {};

                if (!resource || !method) {
                    $log.error('abpApi.resolve requires correct action parameter (resourceName@methodName)');
                    return false;
                }

                // Create a new deferred object
                var deferred = $q.defer();

                // Get the correct resource definition from api object
                var apiObject = findApiObject(resource);

                if (!apiObject) {
                    $log.error('Resource "' + resource + '" is not defined in the api service!');
                    deferred.reject('Resource "' + resource + '" is not defined in the api service!');
                }
                else {
                    apiObject[method](params,

                        // SUCCESS
                        function (response) {
                            // Emit an event
                            $rootScope.$broadcast('abpApi::requestSuccess');

                            if (response.data) {
                                // Resolve the promise
                                deferred.resolve(response.data);
                            } else {
                                deferred.resolve(response);
                            }

                            // Call the success function if there is one
                            if (angular.isDefined(success) && angular.isFunction(success)) {
                                success(response);
                            }
                        },

                        // ERROR
                        function (response) {
                            // Emit an event
                            $rootScope.$broadcast('abpApi::requestError');

                            // Reject the promise
                            deferred.reject(response);

                            // Call the error function if there is one
                            if (angular.isDefined(error) && angular.isFunction(error)) {
                                error(response);
                            }
                        }
                    );
                }

                // Return the promise
                return deferred.promise;
            }

            /**
            * Find API for resource
            *  - find in api array
            *  - find in dynamic generation api of abp
            */
            function findApiObject(resource) {
                // Get the correct resource definition from api object
                var apiObject = api[resource];
                if (apiObject) {
                    if (apiObject.$resource) {
                        return apiObject.$resource;
                    }

                    //build full endpoint
                    Object.keys(apiObject.actions).forEach(function (actionName) {
                        var action = apiObject.actions[actionName];
                        if (['get', 'query', 'delete', 'save', 'update'].indexOf(actionName) === -1) {
                            if (!action.url) {
                                action.url = apiObject.baseUrl + resource + '/' + actionName;
                            } else if (action.url.indexOf(apiObject.baseUrl) === -1) {
                                action.url = apiObject.baseUrl + action.url;
                            }
                        }
                    });

                    // Generate the $resource object based on the stored API object
                    apiObject.$resource = $resource(apiObject.url, apiObject.paramDefaults, apiObject.actions, apiObject.options);
                    return apiObject.$resource;
                }

                //get from service angular
                try {
                    var service = $injector.get('abp.services.' + resource);
                    if (service) {
                        return service;
                    }
                } catch (e) {
                    //nothing
                }

                //find from dynamic api
                if (!abp.services)
                    return false;

                // Split the resource in case if we have a dot notated object
                var resourceParts = resource.split('.'),
                    apiObject = abp.services;

                // Loop through the resource parts and go all the way through
                // the api object and return the correct one
                for (var l = 0; l < resourceParts.length; l++) {
                    if (angular.isUndefined(apiObject[resourceParts[l]])) {
                        $log.error('Resource part "' + resourceParts[l] + '" is not defined!');
                        apiObject = false;
                        break;
                    }

                    apiObject = apiObject[resourceParts[l]];
                }

                if (!apiObject) {
                    return false;
                }

                return apiObject;
            }
        };
    }
})((abp || (abp = {})), (angular || undefined));