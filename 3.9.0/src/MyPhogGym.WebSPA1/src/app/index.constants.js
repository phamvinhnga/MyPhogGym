(function () {
    'use strict';

    angular
        .module('xyz')
        .constant('APPCONF', {
            baseUrl: 'http://localhost:6634/',
            //loginUrl: 'http://sso.trenet.com.vn/auth/login#http://localhost:3000/auth/login',
            loginUrl: 'http://localhost:3000/auth/login',
            authUrl: 'http://localhost:6634/',
            signalRUrl: 'http://localhost:6634/signalr',
            applicationId: 'b8497f81-d94f-4011-b12f-584e9de6962c'
        });

    //SSO   localhost:3002
    //APP   localhost:3000
})();
