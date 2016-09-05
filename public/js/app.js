'use strict';

// Notification
PNotify.prototype.options.styling = 'bootstrap3';
PNotify.prototype.options.styling = 'fontawesome';

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

    $scope.editWs.res = parseJson($scope.editWs.response);

    if (!$scope.editWs.res) {
      $('#editBtn').attr('disabled', false);
      return;
    }

    $http.post('WSedit', $scope.editWs)
      .success((data) => {
        $('#editBtn').attr('disabled', false);
        $('#editModal').modal('hide');
        init();
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Ws correctly edited.'
        });
      })
      .error((err, status) => {
        $('#editBtn').attr('disabled', false);
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  };

  function parseJson(data) {
    try {
      return JSON.parse(data);
    } catch (err) {
      new PNotify({
        type: 'error',
        title: 'How unfortunate !',
        text: 'It seems that your json is invalid. Would you mind fixing it ?'
      });
      return null;
    }
  }

  $scope.create = function() {

    $('#createBtn').attr('disabled', true);

    $scope.newWs.res = parseJson($scope.newWs.response);

    if (!$scope.newWs.res) {
      $('#createBtn').attr('disabled', false);
      return;
    }

    $http.post('WSnew', $scope.newWs)
      .success((data) => {
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Ws correctly created.'
        });
        $('#createBtn').attr('disabled', false);
        $('#newWsModal').modal('hide');
        $scope.newWs = {};
        init();
      })
      .error((err) => {
        $('#createBtn').attr('disabled', false);
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  };

  $scope.writeJsonFile = function() {
    $http.get('WSfile')
      .success((data) => {
        window.location = data;
      })
      .error((err) => {
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  };

  $scope.initRemove = function(target) {
    $scope.removeWs = target.item;
  };

  $scope.remove = function() {
    $('#removeBtn').attr('disabled', false);

    $http.delete('WSRemove/'+ $scope.removeWs._id)
      .success((data) => {
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Ws correctly removed.'
        });
        $('#removeBtn').attr('disabled', false);
        init();
        $('#removeWsModal').modal('hide');
      })
      .error((err) => {
        $('#removeBtn').attr('disabled', false);
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  };

  function init() {
    $http.get('WSlist')
    .success((data) => {
      $scope.ws = data;
    })
    .error((err) => {
      new PNotify({
        type: 'error',
        title: 'Outchy ! Server error...',
        text: err.message
      });
    });
  };

  init();

}]);
