'use strict';

// Notification
PNotify.prototype.options.styling = 'bootstrap3';
PNotify.prototype.options.styling = 'fontawesome';

var mockApp = angular.module('mockApp', []);

mockApp.controller('indexController', ['$scope', '$http', function($scope, $http) {
  $scope.ws = [];

  // APIS
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

  $scope.create = function() {

    $('#createBtn').attr('disabled', true);

    $scope.newWs.res = parseJson($scope.newWs.response);

    if (!$scope.newWs.res) {
      $('#createBtn').attr('disabled', false);
      return;
    }

    $scope.newWs.project = $scope.selectedProject;

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
    $http.get($scope.selectedProject._id +'/WSfile')
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


  // PROJECT
  $scope.createProject = function() {
    $('createProjectBtn').attr('disabled', true);

    $http.post('PJnew', $scope.newProject)
      .success((data) => {
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Project correctly created.'
        });
        $('createProjectBtn').attr('disabled', false);
        $('#newProjectModal').modal('hide');
        init();
      })
      .error((err) => {
        $('createProjectBtn').attr('disabled', false);
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  }


  // FUNCTIONS
  $scope.refreshApis = function() {
    $scope.baseURL = window.location + $scope.selectedProject.key;
    $http.get($scope.selectedProject._id +'/WSlist')
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
  }

  function init() {
    $http.get('PJlist')
      .success((data) => {
        $scope.projects = data;
        if (!$scope.selectedProject) {
          $scope.selectedProject = data[0];
        }
        $scope.refreshApis();
      })
      .error((err) => {
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

  init();

}]);
