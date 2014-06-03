// require stream controller used for the routing
var controller = require('../../controllers/stream_controller');

// provide stream routes
module.exports = function(app) {

  // GET::soundcloud/login -> get connect url
  app.get('/soundcloud/connect', function(req,res) {
    controller.getSoundcloudConnectURL(app, req, res);
  });
	
  // GET::oauth-redirect -> request access token
  app.get('/oauth-redirect', function(req,res) {
    controller.requestAccessToken(app, req, res);
  });
}