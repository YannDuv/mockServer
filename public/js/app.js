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
      .then(() => {
        $('#editBtn').attr('disabled', false);
        $('#editModal').modal('hide');
        init();
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Ws correctly edited.'
        });
      })
      .catch((err, status) => {
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

    if (!$scope.newWs.url.startsWith('/')) {
      $scope.newWs.url = '/'+ $scope.newWs.url;
    }

    $scope.newWs.project = $scope.selectedProject;

    $http.post('WSnew', $scope.newWs)
      .then(() => {
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
      .catch((err) => {
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
      .then((response) => {
        window.location = response.data;
      })
      .catch((err) => {
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
      .then(() => {
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Ws correctly removed.'
        });
        $('#removeBtn').attr('disabled', false);
        init();
        $('#removeWsModal').modal('hide');
      })
      .catch((err) => {
        $('#removeBtn').attr('disabled', false);
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  };

  $scope.addCookie = function() {
    if (!$scope.newWs.cookies) {
      $scope.newWs.cookies = [{}];
    } else {
      $scope.newWs.cookies.push({});
    }
  };
  $scope.addCookieEdit = function() {
    if (!$scope.editWs.cookies) {
      $scope.editWs.cookies = [{}];
    } else {
      $scope.editWs.cookies.push({});
    }
  };

  $scope.removeCookie = function(index) {
    $scope.newWs.cookies.splice(index, 1);
  };
  $scope.removeCookieEdit = function(index) {
    $scope.editWs.cookies.splice(index, 1);
  };

  // PROJECT
  $scope.createProject = function() {
    $('createProjectBtn').attr('disabled', true);

    $http.post('PJnew', $scope.newProject)
      .then(() => {
        new PNotify({
          type: 'success',
          title: 'Ahoy !',
          text: 'Project correctly created.'
        });
        $('createProjectBtn').attr('disabled', false);
        $('#newProjectModal').modal('hide');
        init();
      })
      .catch((err) => {
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

    console.log($scope, $scope.selectedProject);
    $scope.baseURL = window.location + $scope.selectedProject.key;
    $http.get($scope.selectedProject._id +'/WSlist')
      .then((response) => {
        $scope.ws = response.data;
      })
      .catch((err) => {
        new PNotify({
          type: 'error',
          title: 'Outchy ! Server error...',
          text: err.message
        });
      });
  }

  function init() {
    $http.get('PJlist')
      .then(function(response) {
        $scope.projects = response.data;
        if (!$scope.selectedProject) {
          $scope.selectedProject = response.data[0];
        }
        $scope.refreshApis();
      })
      .catch((err) => {
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
