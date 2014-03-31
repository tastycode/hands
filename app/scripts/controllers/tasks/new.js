'use strict';

angular.module('handsApp')
  .controller('NewTaskCtrl', function ($scope, $http, $location) {
    $scope.autoCompletes = {
      origin: {},
      dest: {}
    };

    $scope.autoOptions = {
      type: 'geocode',
      watchEnter: true
    };

    $scope.dayOptions = (function() {
      return _.range(0,10).map(function(i) {
        return moment().add('days', i).format('MM/DD/YY');
      });
    }());
    $scope.timeOptions = (function() {
      var minutesAfter = parseInt(moment().format('mm'));
      var minutesBeforeNextHour = 60 - minutesAfter;
      return _.range(0,24).map(function(i) {
        return moment().add('hours', i).add('minutes', minutesBeforeNextHour).format('h:mm a');
      });
    }());

    $scope.finishByDate = $scope.dayOptions[0];
    $scope.finishByTime = $scope.timeOptions[0];

    $scope.task = {
      type: 'delivery'
    };

    function updateFinishBy() {
      $scope.task.finishBy = $scope.finishByDate + ' ' + $scope.finishByTime;
    }

    $scope.$watch('finishByDate', updateFinishBy);
    $scope.$watch('finishByTime', updateFinishBy);
    $scope.$watch('autoCompletes.origin.details', function(newVal, oldVal) {
      if (newVal && newVal.geometry) {
        $scope.task.originLocation = {
          type: 'Point',
          coordinates: [newVal.geometry.location.lng(), newVal.geometry.location.lat()],
          text: $scope.autoCompletes.origin.text
        }
      }
    }, true);

    $scope.$watch('autoCompletes.dest.details', function(newVal, oldVal) {
      if (newVal && newVal.geometry) {
        $scope.task.destLocation = {
          type: 'Point',
          coordinates: [newVal.geometry.location.e, newVal.geometry.location.d],
          text: $scope.autoCompletes.dest.text
        }
      }
    }, true);

    $scope.createTask = function() {
      $http.post('/api/tasks', $scope.task).success(function(task) {
        $location.path('/home');
      }).error(function(error) {
        $scope.error = error;
      });

    }
  });
