'use strict'

var mockApp = angular.module('mockApp', []);

mockApp.controller('indexController', ['$scope', '$http', function($scope, $http) {
  $scope.ws = [];

  $http.get('listWs')
    .success((data) => {
      var array = [];
      var item;

      for (var key in data) {
        item = {};
        item.value = data[key];
        item.url = key;
        array.push(item);
      }
      $scope.ws = array;
    })
    .error((err) => {
      console.error(err);
    });
}]);
