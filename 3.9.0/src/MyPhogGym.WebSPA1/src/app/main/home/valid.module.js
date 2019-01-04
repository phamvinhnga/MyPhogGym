(function () {
    'use strict';

    angular
        .module('app.valid', ['app.core'])
        .config(config)
        .factory('valid', valid);

    /** @ngInject */
    function config() {
    }

    /** @ngInject */
    function valid() {
        var factory = {
            validClassInput: validClassInput
        };

        return factory;

        function validClassInput(input) {
            return !input.$touched || input.$valid ? 'form-group form-md-line-input' : 'form-group form-md-line-input has-error';
        };
    }
})();
