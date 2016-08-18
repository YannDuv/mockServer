'use strict';

var mockApp = angular.module('mockApp', []);

mockApp.controller('indexController', ['$scope', '$http', function($scope, $http) {
  $scope.ws = [];

  $scope.initEdit = function(target) {
    $('#editBtn').attr('disabled', false);
    $scope.editWs = target.item;
    $scope.editWs.response = $scope.editWs.response.toString();
  };

  $scope.edit = function() {
    $('#editBtn').attr('disabled', true);
    $scope.editWs.res = JSON.parse($scope.editWs.response);
    console.log($scope.editWs);

    $http.post('WSedit', $scope.editWs)
      .success((data) => {
        $('#editBtn').attr('disabled', false);
        $('#editModal').modal('hide');
        init();
      })
      .error((err) => {
        $('#editBtn').attr('disabled', false);
        console.error(err);
      });
  };

  function init() {
    $http.get('WSlist')
    .success((data) => {
      $scope.ws = data;
    })
    .error((err) => {
      console.error(err);
    });
  };

  init();

}]);
