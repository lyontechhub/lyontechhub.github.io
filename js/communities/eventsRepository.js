define(['./module'], function(app) {
    'use strict';

    var mapEvents = function(googleEvent) {
        return {
            title: googleEvent.summary,
            description: googleEvent.description,
            location: googleEvent.location,
            startDate: Date.parse(googleEvent.start.dateTime),
            endDate: Date.parse(googleEvent.end.dateTime),
            url: googleEvent.htmlLink
        }
    };

    var eventsRepository = function($http, $q) {
        this.getCommunityEvents = function(patterns, minDate, maxDate) {
            var deferred = $q.defer();
            $http.get("https://www.googleapis.com/calendar/v3/calendars/ck2ruq6cqfch3t4gshbd6vdnd4@group.calendar.google.com/events?key=AIzaSyAHKI9T7fhK68b2eggUCHlu9eOwsdFUrhg&singleEvents=true"
                        + "&q=" + patterns[0] + "&orderBy=startTime"
                        + "&timeMin=" + minDate.toISOString()
                        + "&timeMax=" + maxDate.toISOString())
                .success(function(data) {
                    deferred.resolve(data.items.map(mapEvents));
                });
            return deferred.promise;
        };
    };

    app.factory('eventsRepository', ['$http', '$q', function($http, $q) {
        return new eventsRepository($http, $q);
    }]);
});