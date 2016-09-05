'use strict';

const api = require('./controllers/api.controller');
const Api = require('./models/api.model.js').Api;

module.exports = function(app) {

  // Add custom route for CA authentication
  app.get('/:envCode/iphoneservice/authentication/grid', (req, res) => {
    res.sendFile(__dirname +'/public/img/grid.jpeg');
  });

  // List all the ws
  app.get('/WSlist', api.list);

  // Edit requests
  app.post('/WSnew', api.create);

  // Edit requests
  app.post('/WSedit', api.edit);

  // Export json file with all apis
  app.get('/WSfile', api.generateJsonFile);

  // Remove an api
  app.delete('/WSRemove/:id', api.delete);

  // Manage post requests
  app.post('/*', api.mock('POST'));

  // Manage get requests
  app.get('/*', api.mock('GET'));

  // Manage delete requests
  app.delete('/*', api.mock('DELETE'));

  // Manage put requests
  app.put('/*', api.mock('PUT'));

  return app;
};
