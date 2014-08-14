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