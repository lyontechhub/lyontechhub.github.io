var app = angular.module("lyontechhub", ["mgcrea.ngStrap.navbar", "ngRoute"]);

app.config(["$routeProvider", function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "views/welcome.html"
		})
		.when("/calendrier", {
			templateUrl: "views/calendar.html"
		})
		.when("/communautes", {
			templateUrl: "views/communities.html"
		})
		.when("/a-propos", {
			templateUrl: "views/about.html"
		})
		.otherwise({
			redirectTo: "/"
		});
}]);