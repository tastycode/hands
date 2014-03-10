'use strict';

angular.module('handsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAutocomplete',
  'checklist-model',
  'angularMoment',
  'angular-parallax'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/tasks/new', {
        templateUrl: 'partials/tasks/new',
        controller: 'NewTaskCtrl',
        authenticate: true
      })
      .when('/tasks/:id', {
        templateUrl: 'partials/tasks/show',
        controller: 'ShowTaskCtrl',
        authenticate: true
      })
      .when('/tasks/:id/edit', {
        templateUrl: 'partials/tasks/edit',
        controller: 'EditTaskCtrl',
        authenticate: true
      })
      .when('/home', {
        templateUrl: 'partials/home.html',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });
