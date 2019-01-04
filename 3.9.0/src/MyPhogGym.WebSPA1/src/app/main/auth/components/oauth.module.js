(function () {
    'use strict';

    angular.module('app.oauth', ['app.storage'])
        .provider('oauthService', oauthServiceProvider)
        .factory('AccessToken', accessTokenFactory)
        .factory('Endpoint', endPointFactory)
        .factory('Profile', profileFactory)
        .factory('AuthorizationInterceptor', authorizationInterceptorFactory)
        .factory('authService', authServiceFactory)
        .config(oauthConfig)
        .run(oauthRun);

    /** ngInject */
    function oauthConfig($httpProvider) {
        $httpProvider.interceptors.push('AuthorizationInterceptor');
    }

    /** ngInject */
    function oauthRun($rootScope, AccessToken, authService) {
        // destroy token when expired
        var oAuthExpired = $rootScope.$on('oauth:expired', function () {
            AccessToken.destroy();
        });

        // Cleanup
        $rootScope.$on('$destroy', function () {
            oAuthExpired();
        });

        // call init
        authService.initialize()
            .then(function () {
                //$rootScope.currentUser = Profile.get();
            });
    }

    /** ngInject */
    function oauthServiceProvider(storageServiceProvider) {
        //configuration for oauth
        var oauthSettings = {
            site: '',
            clientId: 'APP',
            clientSecret: '',
            paths: {
                profileUri: 'api/services/app/userInfomation/getLoginUser'
            },
            session: {
                storage: 'session'
            }
        };

        /**
         * provider
         * @returns {type}
         */
        this.$get = function () {
            var service = {
                configuration: configuration,
                isUseSession: isUseSession
            };

            return service;
        };

        /**
         * Configuration for oauth
         * @param {object} settings
         */
        this.setConfiguration = function (settings) {
            if (!angular.isObject(settings))
                return;

            angular.merge(oauthSettings, settings);

            // set storage type
            // note: authentication data is set to cookie now
            if (oauthSettings.session.storage === 'session') {
                storageServiceProvider.useStorage('sessionStorage');
            } else {
                storageServiceProvider.useStorage('localStorage');
            }
        };

        /**
         * return configuration
         * @returns {Object} ff
         */
        function configuration() {
            return oauthSettings;
        }

        function isUseSession() {
            return oauthSettings.session.storage === 'session';
        }
    }

    //=====================================================
    // access token
    // event: 'oauth:login' : not yet sure user is authenticated, just login event
    //        'oauth:expired': token is expired
    /** @ngInject */
    function accessTokenFactory(storageService, $rootScope, $location, $interval, $timeout) {
        var oAuth2HashTokens = [
            'access_token', 'token_type', 'expired_in', 'scope', 'state',
            'error', 'error_description'
        ], intervalExpire = null;
        var service = {
            token: null,
            get: get,
            set: set,
            destroy: destroy,
            expired: expired,
            setTokenFromString: setTokenFromString,
            setTokenFromResponse: setTokenFromResponse
        };

        return service;

        /**
          * Returns the access token.
          */
        function get() {
            return this.token;
        }

        /**
          * Sets and returns the access token. It tries (in order) the following strategies:
          * - takes the token from the fragment URI
          * - takes the token from the sessionStorage
          */
        function set() {
            this.setTokenFromString($location.hash());

            //If hash is present in URL always use it, cuz its coming from oAuth2 provider redirect
            if (null === this.token) {
                setTokenFromSession();
            }

            return this.token;
        }

        /**
          * Delete the access token and remove the session.
          * @returns {null}
          */
        function destroy() {
            storageService.removeAuth();
            storageService.setCookie('addOnInfoToken', null);

            this.token = null;
            return this.token;
        }

        /**
          * Tells if the access token is expired.
          */
        function expired() {
            return (this.token && this.token.expires_at && new Date(this.token.expires_at) < new Date());
        }

        /**
          * Get the access token from a string and save it
          * broadcast event 'oauth:login'
          * @param hash
          */
        function setTokenFromString(hash, isSession) {
            var params = getTokenFromString(hash);

            if (params) {
                removeFragment();
                setToken(params, isSession);
                setExpiresAt();
                // We have to save it again to make sure expires_at is set
                //  and the expiry event is set up properly
                setToken(this.token, isSession);
                // broastcast event login - not yet check authenticated
                $rootScope.$emit('oauth:login', this.token);
            }
        }
        /**
        * Get the access token from a response and save it
        * broadcast event 'oauth:login'
        * @param hash
        */
        function setTokenFromResponse(response, isSession) {
            if (response) {
                setToken(response, isSession);
                setExpiresAt();
                // We have to save it again to make sure expires_at is set
                //  and the expiry event is set up properly
                setToken(this.token, isSession);
                // broastcast event login - not yet check authenticated
                $rootScope.$emit('oauth:login', this.token);
            }
        }

        /* * * * * * * * * *
          * PRIVATE METHODS *
          * * * * * * * * * */

        /**
          * Set the access token from the sessionStorage.
          */
        function setTokenFromSession() {
            var token = storageService.getAuth(true);
            var addOnInfo = storageService.getCookie('addOnInfoToken') || {};
            if (token) {
                angular.extend(token, addOnInfo);
                setToken(token);
            }
        }

        /**
          * Set the access token.
          *
          * @param params
          * @returns {*|{}}
          */
        function setToken(params, isSession) {
            isSession = angular.isUndefined(isSession) ? true : isSession

            service.token = service.token || {};      // init the token
            angular.extend(service.token, params);      // set the access token params
            setTokenInSession(isSession);                // save the token into the session
            setExpiresAtEvent();                // event to fire when the token expires

            return service.token;
        }

        /**
          * Parse the fragment URI and return an object
          * @param hash
          * @returns {{}}
          */
        function getTokenFromString(hash) {
            var params = {},
                regex = /([^&=]+)=([^&]*)/g,
                m;

            while ((m = regex.exec(hash)) !== null) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }

            if (params.access_token || params.error) {
                return params;
            }
        }

        /**
          * Save the access token into the session
          */
        function setTokenInSession(isSession) {
            // store access token in session
            var storeToken = angular.copy(service.token);
            var accessToken = _.pick(storeToken, ['access_token', 'expired_in', 'expires_at']);
            var addonInfo = _.omit(storeToken, ['access_token', 'expired_in', 'expires_at']);

            storageService.setAuth(accessToken, true, isSession);

            var time = accessToken.expires_at? (new Date(accessToken.expires_at) - new Date() + 3600000) / 86400000 : 0; //1000 * 60 * 60 * 24

            storageService.setCookie('addOnInfoToken', addonInfo, time);
        }

        /**
          * Set the access token expiration date (useful for refresh logics)
          */
        function setExpiresAt() {
            if (!service.token) {
                return;
            }
            if (typeof (service.token.expired_in) !== 'undefined' && service.token.expired_in !== null) {
                var expires_at = new Date();
                expires_at.setSeconds(expires_at.getSeconds() + parseInt(service.token.expired_in) - 60); // 60 seconds less to secure browser and response latency
                service.token.expires_at = expires_at;
            }
            else {
                service.token.expires_at = null;
            }
        }

        /**
          * Set the timeout at which the expired event is fired
          */

        function setExpiresAtEvent() {
            // Don't bother if there's no expires token
            if (typeof (service.token.expires_at) === 'undefined' || service.token.expires_at === null) {
                return;
            }
            var time = (new Date(service.token.expires_at)) - (new Date());
            if (time && time < 2147483647) {
                if (intervalExpire) {
                    $interval.cancel(intervalExpire);
                }
                intervalExpire = $timeout(function () {
                    $rootScope.$emit('oauth:expired', service.token);
                }, time, false);
            }
        }

        /**
          * Remove the oAuth2 pieces from the hash fragment
          */
        function removeFragment() {
            var curHash = $location.hash();
            angular.forEach(oAuth2HashTokens, function (hashKey) {
                var re = new RegExp('&' + hashKey + '(=[^&]*)?|^' + hashKey + '(=[^&]*)?&?');
                curHash = curHash.replace(re, '');
            });

            $location.hash(curHash);
        }
    }

    //=====================================================

    /**
    * build url for request oauth server
    */
    /** @ngInject */
    function endPointFactory() {
        var service = {
            config: null,
            set: set,
            get: get,
            getToken: getToken,
            redirect: redirect
        };

        return service;

        /**
          * Defines the authorization URL
          */
        function set(configuration) {
            this.config = configuration;
            return this.get();
        }

        /**
         * @param overrides
         * @returns Returns the authorization URL
         */
        function get(overrides) {
            var params = angular.extend({}, this.config, overrides);
            var oAuthScope = (params.scope) ? encodeURIComponent(params.scope) : '',
                state = (params.state) ? encodeURIComponent(params.state) : '',
                authPathHasQuery = (params.paths.authorizePath && params.paths.authorizePath.indexOf('?') === -1) ? false : true,
                appendChar = (authPathHasQuery) ? '&' : '?',    //if authorizePath has ? already append OAuth2 params
                responseType = (params.responseType) ? encodeURIComponent(params.responseType) : '';

            var url = params.site +
                params.paths.authorizePath +
                appendChar + 'response_type=' + responseType + '&' +
                'client_id=' + encodeURIComponent(params.clientId) + '&' +
                'redirect_uri=' + encodeURIComponent(params.redirectUri) + '&' +
                'scope=' + oAuthScope + '&' +
                'state=' + state;

            if (params.nonce) {
                url = url + '&nonce=' + params.nonce;
            }
            return url;
        }

        /**
         *
         * @param loginData: login data with userName, password, clientId, nonce
         * @param overrides
         * @returns Returns the token URL
         */
        function getToken(loginData, overrides) {
            var params = angular.extend({}, service.config, overrides);
            var url = "grant_type=password&username=" + loginData.username + "&identifier=" + loginData.username + "&password=" + loginData.password + "&client_id=" + encodeURIComponent(params.clientId);

            if (params.nonce) {
                url = url + '&nonce=' + params.nonce;
            }
            return url;
        }

        /**
         *
         * @param overrides
         * @returns Redirects the app to the authorization URL
         */
        function redirect(overrides) {
            var targetLocation = this.get(overrides);
            window.location.replace(targetLocation);
        }
    }

    //=====================================================

    // profile
    /** @ngInject */
    function profileFactory($http, storageService) {
        var profile;
        var service = {
            find: find,
            findWithToken: findWithToken,
            get: get,
            set: set,
            restoreProfileFromSession: restoreProfileFromSession
        };

        return service;

        /**
         * get profile information from uri
         * @param uri
         * @returns promise
         */
        function find(uri) {
            return $http.post(uri, {}, { abp: true })
                .then(function (response) {
                    response = response.data || response;
                    profile = set(response);

                    return profile;
                });
            return null;
        }

        /**
         * get profile information from uri
         * @param uri
         * @param accessToken
         * @returns promise
         */
        function findWithToken(uri, accessToken) {
            var headers = {
                "Authorization": "Bearer " + accessToken
            };
            var promise = $http.post(uri, {}, { headers: headers, abp: true });
            promise.then(function (response) {
                profile = set(response.data || response);
            });
            return promise;
        }

        /**
         *
         * @returns profile
         */
        function get() {
            if (profile != null) {
                return profile;
            }

            profile = find();
        }

        /**
         * set and return profile from resource
         * @param resource
         * @returns
         */
        function set(resource) {
            profile = resource;
            setProfileInSession();
            return profile;
        }

        /**
          * restore the profile from the sessionStorage.
          */
        function restoreProfileFromSession() {
            var params = storageService.getUserInfo();
            if (params) {
                profile = params;
            }
            return profile;
        }

        /**
          * Save the access token into the session
          */
        function setProfileInSession() {
            storageService.setUserInfo(profile);
        }
    }

    //=======================================================

    // interceptor to http request
    // insert token to authorization header
    // event: 'oauth:expired'
    /** @ngInject */
    function authorizationInterceptorFactory($rootScope, $q, AccessToken) {
        var service = {
            request: request,
            response: response,
            responseError: responseError
        };

        return service;
        /**
        * set authorization header with token when valid
        * broadcast 'oauth:expired' when token is expired
        * @param config
        */
        function request(config) {
            var token = AccessToken.get();
            if (token && AccessToken.expired()) {
                $rootScope.$emit('oauth:expired', token);
            }
            else if (token) {
                config.headers.Authorization = 'Bearer ' + token.access_token;
            }

            return config;
        }

        /**
        * process response data for error 401
        * if status = 401 and token is expired --> broadcast event 'oauth:expired'
        * if status = 401 and token isnt expired --> broadcast event 'oauth:unauthorized'
        * if status = 500 --> broadcast event 'oauth:internalservererror'
        * @param response
        */
        function response(responseData) {
            var token = AccessToken.get();
            if (responseData.status === 401) {
                if (AccessToken.expired()) {
                    $rootScope.$emit('oauth:expired', token);
                } else {
                    $rootScope.$emit('oauth:unauthorized', token);
                }
            }
            else if (responseData.status === 500) {
                $rootScope.$emit('oauth:internalservererror');
            }
            return responseData || $q.when(responseData);
        }
        /**
         * process response data for error 401
         * if status = 401 and token is expired --> broadcast event 'oauth:expired'
         * if status = 401 and token isnt expired --> broadcast event 'oauth:unauthorized'
         * if status = 500 --> broadcast event 'oauth:internalservererror'
         * @param response
         */
        function responseError(responseData) {
            var config = responseData.config || {};

            if (!config.ignoreAuthModule) {
                var token = AccessToken.get();
                if (responseData.status === 401) {
                    if (AccessToken.expired()) {
                        $rootScope.$emit('oauth:expired', token);
                    } else {
                        $rootScope.$emit('oauth:unauthorized', token);
                    }
                }
                else if (responseData.status === 500) {
                    $rootScope.$emit('oauth:internalservererror');
                }
            }
            // otherwise, default behaviour
            return $q.reject(responseData);
        }
    }

    //==========================================================

    // authService
    /** @ngInject */
    function authServiceFactory($rootScope, $q, AccessToken, Endpoint, Profile, $http, oauthService) {
        var oauthConfigs = oauthService.configuration();

        var service = {
            initialize: initialize,

            getProfile: getProfile,
            initProfile: initProfile,
            logout: logout,

            getAccessToken: getAccessToken,
            setAccessToken: setAccessToken,
            resetAccessToken: resetAccessToken,

            isAuthentication: isAuthentication,

            destroyAuthentication: destroyAuthentication,

            checkAthentication: checkAthentication,

            isInitialized: false,
        };

        return service;

        /**
        * initialize when module is running
        * @returns promise
        */
        function initialize() {
            var self = this;
            // sets the oauth authorization url
            Endpoint.set(oauthConfigs);
            // sets the access token object (if existing, from fragment or session)
            AccessToken.set();

            //get profile information
            if (self.isAuthentication()) {
                self.initProfile()
                    .then(function (profile) {
                        $rootScope.$emit('oauth:profile', profile);   
                        Profile.set(profile);
                    });

            }
            
            //check authentication
            return self.checkAthentication()
                .finally(function suc() {
                    self.isInitialized = true;
                });
        }

        /**** PRIVATE FUNCTION ***/

        /**
         * first: restore profile from session, if not exists -> get profile if token is valid
         * ajax request
         * @param settings
         * @returns promise
         */
        function initProfile(force, uri) {
            var profileUrl = uri || oauthConfigs.paths.profileUri;
            force = !!force;
            if (!force) {
                var profile = Profile.restoreProfileFromSession();
                if (profile) {
                    return $q.when(profile);
                }
            }

            return Profile.find(oauthConfigs.site + profileUrl);
        }

        /**
         * check authentication for current
         * @returns true or false
         */
        function isAuthentication() {
            var token = AccessToken.get();
            return token != null && token.access_token && !AccessToken.expired();
        }

        /**
        * Set token, and check is authentication with fire event
        * @params {object} token
        */
        function setAccessToken(token, isSession) {
            var self = this;
            AccessToken.setTokenFromResponse(token, isSession);
            
            if (self.isAuthentication()) {

                $rootScope.$emit('oauth:authorized', token);

                self.initProfile()
                    .then(function (profile) {
                        $rootScope.$emit('oauth:profile', profile);
                        Profile.set(profile);
                    });
            }

            return token;
        }

        /**
        * Set token, and check is authentication with fire event
        * @params {object} token
        */
        function resetAccessToken(token, isSession) {
            var self = this;
            AccessToken.setTokenFromResponse(token, isSession);

            if (self.isAuthentication()) {

                $rootScope.$emit('oauth:authorized', token);

                self.initProfile(true)
                    .then(function (profile) {
                        $rootScope.$emit('oauth:profile', profile);
                        Profile.set(profile);
                    });
            }

            return token;
        }

        /**
         * logout
         * send request to server and clear all data authentication
         * broadcast event 'oauth:logout'
         * @returns
         */
        function logout() {
            var token = AccessToken.get();
            var accessToken = token.access_token;

            destroyAuthentication();

            if (accessToken) {
                var headers = {
                    "Authorization": "Bearer " + accessToken
                }
                return $http.get(oauthConfigs.site + oauthConfigs.paths.signOutUri, { headers: headers })
                    .then(function logoutSuccess(response) {
                        return response.data || response;
                    }, function logoutError(err) {
                        return err;
                    })
                    .finally(function logoutCompleted() {
                        $rootScope.$emit('oauth:logout');
                    });
            } else {
                $rootScope.$emit('oauth:logout');
                return $q.when(true);
            }
        }

        /**
         * @returns profile
         */
        function getProfile() {
            var profile = Profile.get();
            if (profile != null)
                return $q.when(profile);

            return null;
        }

        /**
         * return access token
         * @returns {string}
         */
        function getAccessToken() {
            var token = AccessToken.get();
            return token && token.access_token;
        }

        /**** PRIVATE FUNCTION ***/

        /**
         * check whether user is authentication when init
         * broadcast event: 'oauth:authorized' when valid else 'oauth:denied'
         * @return promise with given value:
         *  - false: check authentication failure
         *  - object: profile
         */
        function checkAthentication() {
            var self = this;
            var token = AccessToken.get();

            if (token) {

                if (token.error) {
                    $rootScope.$emit('oauth:denied', token);
                }

                if (token.access_token && !AccessToken.expired()) {
                    $rootScope.$emit('oauth:authorized', token);
                } else {
                    //clear token
                    destroyAuthentication();
                }
            }

            var deferrer = $q.defer();
            
            return deferrer.promise;
        }

        /**
        * clear all data for authentication
        * @returns
        */
        function destroyAuthentication() {
            AccessToken.destroy();
            Profile.set(null);

            $rootScope.$emit('oauth:destroy');
        }
    }
})();
