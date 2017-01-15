define(['./module'], function(app) {
    'use strict';

    var addImages = function(conference) {
        if (!conference.image) {
            conference.image = conference.key + ".png";
        }
    };

    var conferencesRepository = function($http) {
        this.getOne = function(key) {
            return $http.get("/data/" + key + ".json").success(addImages);
        };
        this.getAll = function() {
            return $http.get("/data/conferences.json").success(function(conferences) {
                return conferences.forEach(addImages);
            });
        };
    }

    app.factory('conferencesRepository', ['$http', function($http) {
       return new conferencesRepository($http);
    }]);
});
