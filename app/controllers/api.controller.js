'use strict';

const fs = require('fs');
const Api = require('../models/api.model').Api;
const Project = require('../models/project.model').Project;
const handleError = require('../error').handleError;

function getOptions(options) {
  let result;
  try {
    result = JSON.parse(options);
  } catch (err) {
    console.error(err);
  }
  return !result ? {} : result;
}

function mockResponse(req, res, method) {

  Project.findOne({key: req.params.projectKey})
    .then((project) => Api.find({method: method, project: project}))
    .then((apis) => {
      let route;
      let api;
      let options;

      // required for iOS
      res.set('Content-Type', 'application/json');

      for (let i=0; i<apis.length; i++) {
        api = apis[i];
        route = api.url.replace(/\/:[a-zA-Z0-9]*/gi, '\/[a-zA-Z0-9\-]*');
        if (req.url.match(route)) {
          for (let j=0; j<api.cookies.length; j++) {
            res.cookie(
              api.cookies[j].name,
              api.cookies[j].value,
              getOptions(api.cookies[j].options)
            );
          }
          return res.status(api.status).send(api.response);
        }
      }
      res.status(404).send({
        title: 'Not found',
        type: 'error',
        message: `Tudieu ! 404 Error.\nRequest not found for path: ${req.url}.\nMethod: ${req.method}.`
      });
    })
    .catch((err) => handleError(res, err));
};

exports.mock = function(method) {
  return (req, res) => mockResponse(req, res, method);
};

exports.list = function(req, res) {
  Api.find({project: req.params.projectId}).populate('project')
    .then((results) => res.send(results))
    .catch((err) => handleError(res, err));
};

exports.create = function(req, res) {
  console.info(`NEW - ${req.body.url}`);

  let api = new Api(req.body);
  api.save()
    .then(() => res.send('ok'))
    .catch((err) => handleError(res, err));
};

exports.edit = function(req, res) {
  console.info(`EDIT - ${req.body._id}`);

  Api.findByIdAndUpdate(req.body._id, {$set: {response: req.body.response, cookies: req.body.cookies}})
    .then(() => res.send('Everything is awesome !'))
    .catch((err) => handleError(res, err));
};

exports.generateJsonFile = function(req, res) {
  let fileName = '/data/apis.json'

  Api.find({project: req.params.projectId})
    .then((results) => {
      fs.writeFile(__dirname.replace('/app/controllers', '') +'/pulic'+ fileName, results, (err) => {
        if (err) {
          return handleError(res, {message: err.code});
        }
        res.send(fileName);
      });
    })
    .catch((err) => handleError(res, err));
};

exports.delete = function(req, res) {
  Api.findByIdAndRemove(req.params.id)
    .then(() => res.send('BAM ! Well shot :)'))
    .catch((err) => handleError(res, err));
};
