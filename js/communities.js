var app = angular.module("lyontechhub.communities", ["ngRoute"]);

app.controller("CommunitiesViewModel", ["$http", function($http){
    var self = this;
    self.communities = [];

    $http.get("/data/communities.json").success(function(data) {
        self.communities = data;
        $('body').scrollspy({ target: '.communitiesNav', offset: 50 })
    });
}]);