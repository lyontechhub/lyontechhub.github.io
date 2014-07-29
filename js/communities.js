var app = angular.module("lyontechhub.communities", ["ngRoute"]);

app.controller("CommunitiesViewModel", ["$http", function($http){
    var self = this;
    self.communities = [];

    $http.get("/data/communities.json").success(function(data) {
        self.communities = data;
        // Does not work...$('body').scrollspy({ target: '.communitiesNav', offset: 50 })
    });
}]);

app.controller("CommunityViewModel", ["$routeParams", "$http", function($routeParams, $http) {
    var self = this;
    self.key = $routeParams.key;
    self.community = {};

    $http.get("/data/" + self.key + ".json").success(function(data) {
        self.community = data;
    });

    $http.get("/data//communities.json").success(function(data) {
        var currentCommunity = $.grep(data, function(item) {
            return item.key === self.key;
        });
        $.extend(self.community, currentCommunity[0]);
    });
}]);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/communaute/:key", {
            templateUrl: "views/community.html",
            controller: "CommunityViewModel",
            controllerAs: "communityViewModel"
        });
}]);