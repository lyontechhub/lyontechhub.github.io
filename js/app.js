define([
    'angular',
    'angularRoute',
    'angularStrapNavBar',
    'angularScroll',
    './communities/index'
], function(angular) {
    'use strict';

    var app = angular.module("lyontechhub", ["ngRoute", "mgcrea.ngStrap.navbar", 'duScroll', "lyontechhub.communities"]);

    app.config(["$locationProvider", function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }]);

    app.config(["$routeProvider", function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/welcome.html"
            })
            .when("/calendrier", {
                templateUrl: "views/calendar.html"
            })
            .when("/communautes", {
                templateUrl: "views/communities.html",
                controller: "CommunitiesViewModel",
                controllerAs: "communitiesViewModel"
            })
            .when("/a-propos", {
                templateUrl: "views/about.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    }]);

    app.directive('ngScrollTo', function ($location, $anchorScroll) {
        return function(scope, element, attrs) {

            element.bind('click', function(event) {
                event.stopPropagation();
                var off = scope.$on('$locationChangeStart', function(ev) {
                    off();
                    ev.preventDefault();
                });
                var location = attrs.ngScrollTo;
                $location.hash(location);
                $anchorScroll();
            });

        };
    });
});