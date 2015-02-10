'use strict';

var app = angular.module('app', ['ngRoute', 'appControllers', 'appServices', 'appDirectives']);

var appServices = angular.module('appServices', []);
var appControllers = angular.module('appControllers', []);
var appDirectives = angular.module('appDirectives', []);
var options = {};
options.api = {};
options.api.base_url = "http://localhost:8080";


app.config(['$locationProvider', '$routeProvider', 
  function($location, $routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '/view/post.list.html',
            controller: 'PostListCtrl',
	    access: { requiredAuthentication: true }
        }).
       
        when('/admin/login', {
            templateUrl: '/view/login.html',
            controller: 'AdminUserCtrl'
        }).
        when('/admin/logout', {
            templateUrl: '/view/logout.html',
            controller: 'AdminUserCtrl',
            access: { requiredAuthentication: true }
        }).
		when('/admin/register', {
            templateUrl: '/view/register.html',
            controller: 'AdminUserCtrl',
            access: { requiredAuthentication: false }
        }).
        otherwise({
            redirectTo: '/'
        });
}]);


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            $location.path("/admin/login");
        }
    });
});
