define(['angular', 'angularRoute'], function(angular) {
    'use strict';

    var app = angular.module("lyontechhub.communities", ["ngRoute"]);

    app.config(["$routeProvider", function($routeProvider) {
        $routeProvider
            .when("/communaute/:key", {
                templateUrl: "views/community.html",
                controller: "CommunityViewModel",
                controllerAs: "communityViewModel"
            });
    }]);

    return app;
});