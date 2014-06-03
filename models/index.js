// provide models under a specific name
module.exports = function(app) {
  app.models = {}
  app.models.tracklist = require('./tracklist.js');
};
