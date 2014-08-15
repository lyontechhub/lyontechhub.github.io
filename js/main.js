require.config({
    baseUrl: '',

    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        'domReady': '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
        'angular': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min'
    },

    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        }
    }
});

require([
    'require',
    'angular',
    'app'
], function(require, angular) {
        'use strict';

        require(['domReady'], function(document) {
            angular.bootstrap(document, ['lyontechhub']);
        });
    }
);
