define(['./module', './communitiesRepository'], function(app) {
    'use strict';

    app.controller("CommunitiesViewModel", ["communitiesRepository", function(communitiesRepository){
        var self = this;
        self.communities = [];

        communitiesRepository.getAll().success(function(data) {
            self.communities = data;
            // Does not work...$('body').scrollspy({ target: '.communitiesNav', offset: 50 })
        });
    }]);
});
