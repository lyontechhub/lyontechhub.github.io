define(['./module', './communitiesRepository'], function(app) {
    'use strict';

    app.controller("CommunitiesViewModel", ["communitiesRepository", function(communitiesRepository){
        var self = this;
        self.query;
        self.communities = [];

        communitiesRepository.getAll().success(function(data) {
            self.communities = data;
        });
    }]);
});
