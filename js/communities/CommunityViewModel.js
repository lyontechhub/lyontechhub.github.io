define(['./module', './communitiesRepository', 'jquery'], function(app) {
    'use strict';

    app.controller("CommunityViewModel", ["$routeParams", "communitiesRepository", function($routeParams, communitiesRepository) {
        var self = this;
        self.key = $routeParams.key;
        self.community = {};

        communitiesRepository.getOne(self.key).success(function(data) {
            self.community = data;
        });

        communitiesRepository.getAll().success(function(data) {
            var currentCommunity = $.grep(data, function(item) {
                return item.key === self.key;
            });
            $.extend(self.community, currentCommunity[0]);
        });
    }]);
});
