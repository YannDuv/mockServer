'use strict';

const Project = require('../models/project.model.js').Project;

exports.create = function(req, res) {
  console.info(`Create project ${req.body.name}`);

  let project = new Project(req.body);
  project.save((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    return res.send('ok');
  });
}

exports.list = function(req, res) {
  Project.find({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send(results);
  });
}
