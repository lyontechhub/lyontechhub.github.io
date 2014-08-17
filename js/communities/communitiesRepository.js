define(['./module'], function(app) {
    'use strict';

    var communitiesRepository = function($http) {
        this.getOne = function(key) {
            return $http.get("/data/" + key + ".json");
        };
        this.getAll = function() {
            return $http.get("/data/communities.json");
        };
    }

    app.factory('communitiesRepository', ['$http', function($http) {
       return new communitiesRepository($http);
    }]);
});