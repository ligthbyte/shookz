BASE_URL = "http://shookz.com/api/";

document.addEventListener('deviceready', function() {
  angular.bootstrap(document, ['mainApp']);
}, false);

var app = angular.module('mainApp', ['ngCordova', 'ngAnimate', 'ngRoute'])

.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: './views/home.html',
      controller: 'HomeCtrl',
      reloadOnSearch: false //prevent page refresh on ng-include change when changing url's param
    }).
    when('/login', {
        templateUrl: './views/login.html',
        controller: 'LoginCtrl'
    }).
    when('/register', {
        templateUrl: './views/register.html',
        controller: 'RegisterCtrl'
    }).
    otherwise({ redirectTo: '/' });
});