define(['./module', 'jquery'], function(app) {
    'use strict';

    app.controller("CommunityViewModel", ["$routeParams", "$http", function($routeParams, $http) {
        var self = this;
        self.key = $routeParams.key;
        self.community = {};

        $http.get("/data/" + self.key + ".json").success(function(data) {
            self.community = data;
        });

        $http.get("/data//communities.json").success(function(data) {
            var currentCommunity = $.grep(data, function(item) {
                return item.key === self.key;
            });
            $.extend(self.community, currentCommunity[0]);
        });
    }]);
});
