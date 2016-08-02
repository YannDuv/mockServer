'use strict';

var mockApp = angular.module('mockApp', []);

mockApp.controller('indexController', ['$scope', '$http', function($scope, $http) {
  $scope.ws = [];

  function parseWs(data, method) {
    let array = [];
    let item;

    for (var key in data[method]) {
      item = {};
      item.value = JSON.stringify(data[method][key]);
      item.url = key;
      item.method = method.toUpperCase();
      array.push(item);
    }

    return array;
  }

  $scope.initEdit = function(target) {
    $('#editBtn').attr('disabled', false);
    $scope.editWs = target.item;
    console.log($scope.editWs.value);
    $scope.editWs.value = $scope.editWs.value.toString();
  };

  $scope.edit = function() {
    $('#editBtn').attr('disabled', true);
    $scope.editWs.res = JSON.parse($scope.editWs.value);
    console.log($scope.editWs);

    $http.post('edit', $scope.editWs)
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
    $http.get('listWs')
    .success((data) => {
      $scope.ws = [].concat(parseWs(data, 'get'), parseWs(data, 'post'));
    })
    .error((err) => {
      console.error(err);
    });
  };

  init();

}]);
