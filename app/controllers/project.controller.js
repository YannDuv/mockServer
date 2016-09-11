'use strict';

const Project = require('../models/project.model.js').Project;
const handleError = require('../error').handleError;

exports.create = function(req, res) {
  console.info(`Create project ${req.body.name}`);

  let project = new Project(req.body);
  project.save()
    .then(() => res.send('ok'))
    .catch((err) => handleError(res, err));
};

exports.list = function(req, res) {
  Project.find({})
    .then((results) => res.send(results))
    .catch((err) => handleError(res, err));
};
