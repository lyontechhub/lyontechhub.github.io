define(['./module', './communitiesRepository', './eventsRepository', 'jquery'], function(app) {
    'use strict';

    app.controller("CommunityViewModel", ["$routeParams", "communitiesRepository", "eventsRepository", function($routeParams, communitiesRepository, eventsRepository) {
        var self = this;
        self.key = $routeParams.key;
        self.community = {};
        self.community.pastEvents = [ {
            title: "test",
            startDate: new Date('2014-04-01 19:00'),
            endDate: new Date('2014-04-01 22:00'),
            location: 'test',
            description: 'DEsqgs dgh fh sdffhs  fhfshsdfg qfh sfdh qfdhgsdfh sdfhsdfh sdfhsdfh sdfh sdfh sdfh sdfhs dsdfhsdfh sdfhsdfh .' }];

        communitiesRepository.getOne(self.key).success(function(data) {
            $.extend(self.community, data);
            getEvents(self.community.patternsGoogleCalendar);
        });

        communitiesRepository.getAll().success(function(data) {
            var currentCommunity = $.grep(data, function(item) {
                return item.key === self.key;
            });
            $.extend(self.community, currentCommunity[0]);
        });

        var getEvents = function(pattern) {
            var now = new Date();
            var fourMonthAgo = new Date();
            fourMonthAgo.setDate(fourMonthAgo.getDate() - 4 * 30);
            var fourMonthLater = new Date();
            fourMonthLater.setDate(fourMonthLater.getDate() + 4 * 30);
            eventsRepository.getCommunityEvents(pattern, fourMonthAgo, fourMonthLater).then(function(events) {
                self.community.pastEvents = $.grep(events, function(item) { return item.startDate < now; });
                self.community.nextEvents = $.grep(events, function(item) { return item.startDate > now; });
            });
        }
    }]);
});
