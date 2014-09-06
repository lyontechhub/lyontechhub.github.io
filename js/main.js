require.config({
    baseUrl: '',

    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min',
        'domReady': '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
        'angular': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min',
        'angularRoute': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-route.min',
        'angularSanitize': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-sanitize.min'
    },

    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularRoute' : {
            deps: ['angular']
        },
        'angularSanitize' : {
            deps: ['angular']
        }
    }
});

require([
    'require',
    'angular',
    'bootstrap',
    'app'
], function(require, angular) {
        'use strict';

        require(['domReady'], function(document) {
            angular.bootstrap(document, ['lyontechhub']);
        });
    }
);
