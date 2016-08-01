'use strict'

var mockApp = angular.module('mockApp', []);

mockApp.controller('indexController', ['$scope', '$http', function($scope, $http) {
  $scope.ws = [];

  function parseWs(data, method) {
    let array = [];
    let item;

    for (var key in data[method]) {
      item = {};
      item.value = data[method][key];
      item.url = key;
      item.method = method.toUpperCase();
      array.push(item);
    }

    return array;
  }

  $http.get('listWs')
    .success((data) => {
      $scope.ws = [].concat(parseWs(data, 'get'), parseWs(data, 'post'));
    })
    .error((err) => {
      console.error(err);
    });
}]);
