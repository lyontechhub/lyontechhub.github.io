define(['./module', './conferencesRepository'], function(app) {
    'use strict';

    app.controller("ConferencesViewModel", ["conferencesRepository", function(conferencesRepository){
        var self = this;
        self.query;
        self.conferences = [];

        conferencesRepository.getAll().success(function(data) {
            self.conferences = data;
        });
    }]);
});
