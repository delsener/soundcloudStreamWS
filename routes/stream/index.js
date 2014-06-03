// require stream controller used for the routing
var controller = require('../../controllers/stream_controller');

// provide stream routes
module.exports = function(app) {

  // GET::stream/news/<profile> -> getStream()
  app.get('/stream/news/:profile', function(req,res) {
    controller.getStream(app, req, res);
  });

  //GET::stream/favorites/<profile> -> getFavorites()
  app.get('/stream/favorites/:profile', function(req,res) {
    controller.getFavorites(app, req, res);
  });
}