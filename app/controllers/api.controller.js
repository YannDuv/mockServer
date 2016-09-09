'use strict';

const fs = require('fs');
const Api = require('../models/api.model.js').Api;
const Project = require('../models/project.model.js').Project;

function mockResponse(req, res, method) {

  Project.findOne({key: req.params.projectKey})
    .then((project) => {
      Api.find({method: method, project: project}, (err, apis) => {
        let route;
        let api;

        res.set('Content-Type', 'application/json');

        if (err) {
          console.error(err); res.status(500);
        }

        for (var i=0; i<apis.length; i++) {
          api = apis[i];
          route = api.url.replace(/\/:[a-zA-Z0-9]*/gi, '\/[a-zA-Z0-9\-]*');
          if (req.url.match(route)) {
            return res.status(api.status).send(api.response);
          }
        }
        res.status(404).send({
          title: 'Not found',
          type: 'error',
          message: `Tudieu ! 404 Error.\nRequest not found for path: ${req.url}.\nMethod: ${req.method}.`
        });
      });
  });
};

exports.mock = function(method) {
  return (req, res) => {
    mockResponse(req, res, method);
  }
};

exports.list = function(req, res) {
  Api.find({project: req.params.projectId}).populate('project').exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

exports.create = function(req, res) {
  console.info(`NEW - ${req.body.url}`);

  let api = new Api(req.body);
  api.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    return res.send('ok');
  });
};

exports.edit = function(req, res) {
  console.info(`EDIT - ${req.body._id}`);

  Api.findByIdAndUpdate(req.body._id, {$set: {response: req.body.response}}, (err, api) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    return res.send('Everything is awesome !');
  });
};

exports.generateJsonFile = function(req, res) {
  let fileName = '/data/apis.json'

  Api.find({project: req.params.projectId}, (err, results) => {
    console.log(__dirname.replace('/app/controllers', ''));
    fs.writeFile(__dirname.replace('/app/controllers', '') +'/public'+ fileName, results, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.send(fileName);
    });
  });
};

exports.delete = function(req, res) {
  Api.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send('BAM ! Well shot :)');
  });
};
