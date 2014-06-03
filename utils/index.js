// provide models under a specific name
module.exports = function(app) {
  app.utils = {}
  app.utils.sc = require('./soundcloudUtils.js');
};
