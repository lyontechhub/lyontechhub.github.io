define(['./module'], function(app) {
    'use strict';

    app.controller("CommunitiesViewModel", ["$http", function($http){
        var self = this;
        self.communities = [];

        $http.get("/data/communities.json").success(function(data) {
            self.communities = data;
            // Does not work...$('body').scrollspy({ target: '.communitiesNav', offset: 50 })
        });
    }]);
});
