define(['./module'], function(app) {
    'use strict';

    var mapEvents = function(googleEvent) {
        return {
            id: googleEvent.id,
            title: googleEvent.summary,
            description: googleEvent.description,
            location: googleEvent.location,
            startDate: Date.parse(googleEvent.start.dateTime),
            endDate: Date.parse(googleEvent.end.dateTime),
            url: googleEvent.htmlLink
        }
    };

    var removeDuplicates = function(events) {
      var tmpEvents = {};
      for (var i = 0, n = events.length; i < n; i++) {
        tmpEvents[events[i].id] = events[i];
      }
      var i = 0;
      events = [];
      for(var id in tmpEvents) {
        events[i++] = tmpEvents[id];
      }
      return events;
    };

    var eventsRepository = function($http, $q) {
        this.getCommunityEvents = function(community, minDate, maxDate) {
            var patterns = community.patternsGoogleCalendar;
            if (patterns == undefined){
                patterns = [ community.key ];
            }
            var deferred = $q.defer();
            var asyncGoogleApiCalls = [];
            for(var index = 0; index < patterns.length; index++) {
                asyncGoogleApiCalls.push($http.get("https://www.googleapis.com/calendar/v3/calendars/ck2ruq6cqfch3t4gshbd6vdnd4@group.calendar.google.com/events?key=AIzaSyAHKI9T7fhK68b2eggUCHlu9eOwsdFUrhg&singleEvents=true"
                    + "&q=" + patterns[index]
                    + "&timeMin=" + minDate.toISOString()
                    + "&timeMax=" + maxDate.toISOString()));
            }

            $q.all(asyncGoogleApiCalls).then(function(result){
                var events = [];
                for(var index = 0; index < result.length; index++) {
                    events = events.concat(result[index].data.items.map(mapEvents));
                }
                deferred.resolve(removeDuplicates(events));
            });

            return deferred.promise;
        };
    };

    app.factory('eventsRepository', ['$http', '$q', function($http, $q) {
        return new eventsRepository($http, $q);
    }]);
});
