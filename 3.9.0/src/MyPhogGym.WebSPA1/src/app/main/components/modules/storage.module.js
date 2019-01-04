(function () {
    'use strict';

    angular.module('app.storage', ['LocalStorageModule'])
        .config(config)
        .provider('storageService', storageServiceProvider);

    /** @ngInject */
    function config(localStorageServiceProvider) {
        //setting storage use session storage with fallback cookie
        localStorageServiceProvider
            .setPrefix('APP')
            .setStorageType('localStorage')
            .setStorageCookie(0, '/') //set use cookie session
            .setNotify(true, true)
          //  .setStorageCookieDomain('localhost');
    }

    /** @ngInject */
    function storageServiceProvider(localStorageServiceProvider) {
        // provider function
        this.useStorage = useStorage;

        /** @ngInject */
        this.$get = function (localStorageService) {
            var service = {
                storage: localStorageService,
                setAuth: setAuth,
                setUserInfo: setUserInfo,
                getAuth: getAuth,
                getUserInfo: getUserInfo,
                removeAuth: removeAuth,
                get: get,
                set: set,
                getCookie: getCookie,
                setCookie: setCookie,
                remove: remove
            };
            return service;

            /**
             * set token to storage on client
             * @param {string} token
             * @param {boolean} useCookie
             * @param {boolean} cookieSession
             * @returns {type}
             */
            function setAuth(token, useCookie, cookieSession) {
                if (useCookie && localStorageService.cookie.isSupported) {
                    if (cookieSession) {
                        var time = token.expires_at ? (new Date(token.expires_at) - new Date() + 3600000) / 86400000 : 0; //1000 * 60 * 60 * 24
                        return localStorageService.cookie.set('authorizationData', token, time );
                    }
                    else {
                        var time = token.expired_in ? token.expired_in / 86400 : 0;
                        return localStorageService.cookie.set('authorizationData', token, time);
                    }
                } else {
                    return localStorageService.set('authorizationData', token);
                }
            }

            /**
             * get auth from storage
             * @returns {string} token
             */
            function getAuth(useCookie) {
                if (useCookie && localStorageService.cookie.isSupported) {
                    return localStorageService.cookie.get('authorizationData');
                } else {
                    return localStorageService.get('authorizationData');
                }
            }
            /**
             *
             * @param {object} userInfo
             * @returns {type}
             */
            function setUserInfo(userInfo) {
                return localStorageService.set('userInfo', userInfo);
            }

            /**
             * Get userinfo from storage
             * @returns {object} profile
             */
            function getUserInfo() {
                return localStorageService.get('userInfo');
            }

            /**
             * remove all information authentication
             */
            function removeAuth() {
                localStorageService.remove('authorizationData');
                localStorageService.remove('userInfo');
                if (localStorageService.cookie.isSupported) {
                    localStorageService.cookie.remove('authorizationData');
                }
            }

            /**
             * Directly get a value from local storage.
             * If local storage is not supported, use cookies instead.
             * @param {type} key
             * @returns {type}
             */
            function get(key) {
                if (localStorageService.get(key)) {
                    var data = angular.fromJson(localStorageService.get(key));
                    return data;
                }
                return false;
            }

            
            function getCookie(key) {
                if (localStorageService.cookie.isSupported) {
                    return localStorageService.cookie.get(key);
                } else {
                    return localStorageService.get(key);
                }
            }

            /**
             * Directly adds a value to local storage.
             * If local storage is not supported, use cookies instead.
             * @param {string} key
             * @param {Object} val
             * @returns {Boolean}
             */
            function set(key, val) {
                if (val === undefined) {
                    localStorageService.remove(key);
                } else {
                    localStorageService.set(key, angular.toJson(val));
                }
                return localStorageService.get(key);
            }

            function setCookie(key, val) {
                if (val === undefined) {
                    localStorageService.remove(key);
                } else {
                    if (localStorageService.cookie.isSupported) {
                        return localStorageService.cookie.set(key, angular.toJson(val));
                    } else {
                        return localStorageService.set(key, angular.toJson(val));
                    }
                }

                return getCookie(key);
            }

            function setCookie(key, val, time) {
                if (val === undefined) {
                    localStorageService.remove(key);
                } else {
                    if (localStorageService.cookie.isSupported) {
                        return localStorageService.cookie.set(key, angular.toJson(val), time);
                    } else {
                        return localStorageService.set(key, angular.toJson(val));
                    }
                }

                return getCookie(key);
            }

            /**
             * Directly get a value from local storage.
             *   If local storage is not supported, use cookies instead.
             * @param {string} key
             * @returns {Boolean}
             */
            function remove(key) {
                return localStorageService.remove(key);
            }
        };

        /**
         * change storage type
         * @param {string} storageType 'sessionStorage' or 'localStorage'
         */
        function useStorage(storageType) {
            //Store token in 'sessionStorage' or 'localStorage', defaults to 'sessionStorage'
            if (storageType === 'sessionStorage') {
                localStorageServiceProvider.setStorageType('sessionStorage');
            }
            else if (storageType === 'localStorage') {
                localStorageServiceProvider.setStorageType('localStorage');
            }
        }
    }
})();
