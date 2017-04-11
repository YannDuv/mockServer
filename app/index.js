'use strict';

const api = require('./controllers/api.controller');
const project = require('./controllers/project.controller');
const Api = require('./models/api.model.js').Api;
const Project = require('./models/project.model.js').Project;

module.exports = function(app) {

  // Please remove this
  app.get('/executeONCE', (req, res) => {
    Project.findOne({}, (err, project) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(project);
      Api.find({}, (err, apis) => {
        if (err) {
          console.error(err);
          return;
        }
        apis.forEach((api) => {
          api.project = project;
          api.save();
        })
      });
      return res.send('ok');
    });
  });

  // PROJECTS

  // Create a new project
  app.post('/PJnew', project.create);

  app.get('/PJlist', project.list);

  // APIS

  // Add custom route for CA authentication
  app.get('/:envCode/iphoneservice/authentication/grid', (req, res) => {
    res.sendFile(__dirname.replace('/app', '') +'/public/img/grid.jpeg');
  });

  // List all the ws
  app.get('/:projectId/WSlist/', api.list);

  // Edit requests
  app.post('/WSnew', api.create);

  // Edit requests
  app.post('/WSedit', api.edit);

  // Export json file with all apis
  app.get('/:projectId/WSfile', api.generateJsonFile);

  // Remove an api
  app.delete('/WSRemove/:id', api.delete);

  // Manage post requests
  app.post('/:projectKey/*', api.mock('POST'));

  // Manage get requests
  app.get('/:projectKey/*', api.mock('GET'));

  // Manage delete requests
  app.delete('/:projectKey/*', api.mock('DELETE'));

  // Manage put requests
  app.put('/:projectKey/*', api.mock('PUT'));

  // Manage patch requests
  app.patch('/:projectKey/*', api.mock('PATCH'));

  return app;
};
