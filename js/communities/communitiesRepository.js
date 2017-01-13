define(['./module'], function(app) {
    'use strict';

    var addImages = function(community) {
        if (!community.image) {
            community.image = community.key + ".png";
        }
    };

    var communitiesRepository = function($http) {
        this.getOne = function(key) {
            return $http.get("/data/" + key + ".json").success(addImages);
        };
        this.getAll = function() {
            return $http.get("/data/communities.json").success(function(communities) {
                return communities.forEach(addImages);
            });
        };
    }

    app.factory('communitiesRepository', ['$http', function($http) {
       return new communitiesRepository($http);
    }]);
});
