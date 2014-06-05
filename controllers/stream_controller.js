var sc = require("../utils/soundcloudUtils.js");
var async = require("async");

var oauth_access_token = null;

// oauth2 login process 1: get code
exports.getSoundcloudConnectURL = function(app, req, res) {
	sc.getSoundcloudConnectURL(function (error, data) {
		res.json({ url: data });
	});
};

// oauth2 login process 2: request access token
exports.requestAccessToken = function(app, req, res) {
	sc.requestAccessToken(req.query.code, function (error, data) {
		oauth_access_token = data;
		res.json(data);
	});
};

// favorites stream
exports.getFavorites = function(app, req, res) {
	sc.get("/users/" + req.params.profile + "/favorites", {limit:500}, function (error, favorites) {
		console.log("number of tracks: " + favorites.length);
		res.json(favorites);
	}, oauth_access_token);
};

// news stream
exports.getStream = function(app, req, res) {
	sc.get("/users/" + req.params.profile + "/followings", {limit:500}, function (error, followings) {
		var followingsFavorites = [];
		var count = 0;
		
		async.whilst(
		    function () {
		    	if (count < followings.length) {
		    		return true;
		    	}
		    	return false; 
		    },
		    function (callback) {
		    	sc.get("/users/" + followings[count].id + "/favorites", {limit:5}, function (error, favorites) {
		    	  followingsFavorites = followingsFavorites.concat(favorites);
      			  count++;
      			  callback();
      		  });
		    },
		    function (err) {
		    	console.log(followingsFavorites);
		    	res.json(followingsFavorites);
		    }
		);
	}, oauth_access_token);
};