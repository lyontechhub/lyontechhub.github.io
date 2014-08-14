require.config({
    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        'domReady': '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
        'angular': '../bower_components/angular/angular.min',
        'angularRoute': '../bower_components/angular-route/angular-route.min',
        'angularStrap': '../bower_components/angular-strap/dist/angular-strap.min'
    },

    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angularRoute': {
            deps: ['angular']
        },
        'angularStrap': {
            deps: ['angular']
        }
    },

    deps: ['./bootstrap']
});