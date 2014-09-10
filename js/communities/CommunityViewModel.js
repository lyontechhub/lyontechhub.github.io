define(['./module',
    './communitiesRepository',
    './eventsRepository',
    'jquery'], function(app) {
    'use strict';

    app.controller("CommunityViewModel", ["$routeParams", "communitiesRepository", "eventsRepository", function($routeParams, communitiesRepository, eventsRepository) {
        var self = this;
        self.community = { key: $routeParams.key };

        communitiesRepository.getOne(self.community.key).success(function(data) {
            $.extend(self.community, data);
            getEvents(self.community);
        });

        communitiesRepository.getAll().success(function(data) {
            var currentCommunity = $.grep(data, function(item) {
                return item.key === self.community.key;
            });
            $.extend(self.community, currentCommunity[0]);
        });

        var getEvents = function(community) {
            var now = new Date();
            var fourMonthAgo = new Date();
            fourMonthAgo.setDate(fourMonthAgo.getDate() - 4 * 30);
            var fourMonthLater = new Date();
            fourMonthLater.setDate(fourMonthLater.getDate() + 4 * 30);
            eventsRepository.getCommunityEvents(community, fourMonthAgo, fourMonthLater).then(function(events) {
                self.community.pastEvents = $.grep(events, function(item) { return item.startDate < now; });
                self.community.nextEvents = $.grep(events, function(item) { return item.startDate > now; });
            });
        }
    }]);
});
