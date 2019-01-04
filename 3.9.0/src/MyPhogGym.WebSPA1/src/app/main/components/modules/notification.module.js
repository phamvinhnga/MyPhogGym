/*
    notification module with signalr
*/
(function () {
    'use strict';

    angular
        .module('app.notification', ['SignalR', 'app.abp.oauth', 'app.abp'])
        .config(config)
        .run(run)
        .provider('signalRManager', signalRManagerProvider)
        .factory('notification', notificationFactory);

    /** @ngInject */
    function config() {
    }

    /** @ngInject */
    function run($rootScope, signalRManager, abpAuthService) {
        //listen event authorization to setup token
        var watchAuth = $rootScope.$on('oauth:authorized', updateAuth);

        updateAuth();

        $rootScope.$on('$destroy', function () {
            //unregister event
            watchAuth();
        });

        function updateAuth() {
            if (abpAuthService.isAuthentication()) {
                signalRManager.setAuthorization(abpAuthService.getAccessToken());
                //auto connect
                signalRManager.handleStateChange(true);
            } else {
                signalRManager.setAuthorization(null);
                //auto disconnect
                signalRManager.handleStateChange(false);
            }
        }
    }

    /** @ngInject */
    function signalRManagerProvider() {
        var authorizationToken;
        var defaults;
        //default configurations
        this.defaults = defaults = {
            rootPath: '',
            autoConnect: false,
            handleConnectWithState: true // auto connect or disconnect base on authorization state
        };

        /**
         * set default root path for signalr connection
         * @param {type} path
         */
        this.setRootPath = function (path) {
            this.defaults.rootPath = path;
        };

        /**
         * set access token for authentication
         * send in query string and headers
         * @param {type} token
         */
        this.setAuthorization = function (token) {
            authorizationToken = token;
        };

        /** @ngInject */
        this.$get = function (Hub, $log) {
            //store list of hub connection
            var globalHubs = [];

            var service = {
                setAuthorization: setAuthorization,
                registerHub: registerHub,
                onNotification: onNotification,
                handleStateChange: handleStateChange
            };

            return service;

            /**
             * listen event in hub
             * @param {String} hubName
             * @param {String} eventName
             * @param {Fn} callback
             * @returns {}
             */
            function onNotification(hubName, eventName, callback) {
                var hub = globalHubs[hubName];
                if (!hub) {
                    $log.warn('hub with name: ' + hubName + ' is not registed');
                    return;
                }

                return hub.on(eventName, callback);
            }

            /**
             * register hub channel
             * @param {String} hubName
             * @param {Object} options
             * @return {Object} Hub
             */
            function registerHub(hubName, options) {
                var configs = angular.extend({}, defaults, options);

                //add access token to query string
                if (authorizationToken) {
                    configs.queryParams = configs.queryParams || {};
                    configs.queryParam.access_token = authorizationToken;
                }

                var hub = Hub(hubName, configs);

                globalHubs[hubName] = {
                    configs: configs,
                    hub: hub
                };

                return hub;
            }

            /**
             * config authorization token to hub
             * @param {String} token
             */
            function setAuthorization(token) {
                authorizationToken = token;

                for (var hubName in globalHubs) {
                    var hub = globalHubs[hubName].hub;

                    if (hub.connection.qs) {
                        if (angular.isObject(hub.connection.qs)) {
                            hub.connection.qs.access_token = authorizationToken;
                        } else {
                            hub.connection.qs = hub.connection.qs + '&access_token=' + authorizationToken;
                        }
                    } else {
                        hub.connection.qs = { access_token: authorizationToken };
                    }
                }
            };

            /**
             * Handle auto connect on authorization state change
             * @param {bool} connect
             */
            function handleStateChange(connect) {
                for (var hubName in globalHubs) {
                    var hubOption = globalHubs[hubName];
                    var hub = hubOption.hub;
                    var configs = hubOption.configs;

                    if (configs.handleConnectWithState === true) {
                        if (connect) {
                            hub.connect().done(function () {
                                //console.debug('Connected to SignalR server!'); //TODO: Remove log
                            });
                        } else {
                            hub.disconnect();
                        }
                    }
                }
            }
        };
    }

    /** @ngInject */
    function notificationFactory(signalRManager, abpApi, $rootScope) {
        //TODO should config somewhere
        var options = {
            //client side methods
            listeners: {
                'getNotification': getNotification
            },

            //server side methods
            methods: ['register'],
            autoConnect: false
        };
        var hub = signalRManager.registerHub('abpCommonHub', options);

        var service = {
            getNotifications: getNotifications,
            updateNotificationState: updateNotificationState,
            updateAllNotificationStates: updateAllNotificationStates,
            deleteNotification: deleteNotification,
            deleteAllNotifications: deleteAllNotifications,
            on: on
        };

        return service;

        /**
         * get all notifications
         * @returns {promise}
         */
        function getNotifications(options) {
            return abpApi.resolve('app.notification@getUserNotifications', options);
        }

        /**
         * udpate state for notification
         * @returns {promise}
         */
        function updateNotificationState(notificationId, state) {
            return abpApi.resolve('app.notification@updateUserNotificationState', { userNotificationId: notificationId, state: state });
        }

        /**
         * udpate state for all notification
         * @returns {promise}
         */
        function updateAllNotificationStates(userId, state) {
            return abpApi.resolve('app.notification@updateAllUserNotificationState', { userId: userId, state: state });
        }

        /**
         * delete notification
         * @returns {promise}
         */
        function deleteNotification(notificationId) {
            return abpApi.resolve('app.notification@deleteUserNotification', { userNotificationId: notificationId });
        }

        /**
         * delete notification
         * @returns {promise}
         */
        function deleteAllNotifications(userId) {
            return abpApi.resolve('app.notification@deleteAllUserNotification', { userId: userId });
        }

        /**
         * register event 'notification.received'
         * @param {Fn} fn
         * @returns {Fn} deregister event
         */
        function on(fn) {
            return $rootScope.$on('notification.received', fn);
        }

        /**
         * trigger event 'notification.received'
         * @param {type} userNotification
         */
        function getNotification(userNotification) {
            return $rootScope.$emit('notification.received', userNotification);
        }
    }
})();