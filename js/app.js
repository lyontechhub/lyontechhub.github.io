define([
    'angular',
    'angularRoute',
    'angularStrapNavBar',
    'angulartics',
    'angulartics.google.analytics',
    './communities/index'
], function(angular) {
    'use strict';

    var app = angular.module("lyontechhub", ["ngRoute", "mgcrea.ngStrap.navbar", "angulartics.google.analytics", "lyontechhub.communities"]);

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
});