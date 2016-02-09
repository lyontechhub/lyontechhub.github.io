define(['./module'], function(app) {
    'use strict';

    var conferencesRepository = function($http) {
        this.getOne = function(key) {
            return $http.get("/data/" + key + ".json");
        };
        this.getAll = function() {
            return $http.get("/data/conferences.json");
        };
    }

    app.factory('conferencesRepository', ['$http', function($http) {
       return new conferencesRepository($http);
    }]);
});
