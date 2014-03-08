'use strict';

angular.module('handsApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.roles = [
      {id: 'volunteer', text: 'I would like to volunteer my time to help where I can'},
      {id: 'poster', text: 'I have things that need to be done for my organization'}
    ];

    $scope.$watch('autocompleteDetail', function(newVal, oldVal) {
      if (newVal) {
        $scope.user.location = {
          type: 'Point',
          coordinates: [newVal.geometry.location.e, newVal.geometry.location.d],
          text: $scope.autocomplete
        }
      } 
    }, true);

    $scope.register = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          organizationName: $scope.user.organizationName,
          email: $scope.user.email,
          phone: $scope.user.phone,
          roleTags: $scope.user.roleTags,
          location: $scope.user.location,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  });
