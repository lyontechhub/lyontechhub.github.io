require.config({
    baseUrl: '',

    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        'domReady': '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
        'angular': '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular.min',
        'angularRoute': '../bower_components/angular-route/angular-route.min',
        'angularStrapNavBar': '../bower_components/angular-strap/dist/modules/navbar.min'
    },

    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularRoute': {
            deps: ['angular']
        },
        'angularStrapNavBar': {
            deps: ['angular']
        }
    }
});

define([
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