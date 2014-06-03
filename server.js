"use strict";

// required modules
var express = require("express"), // small web-framework
 http = require('http'), // core module
 path = require('path'); // core module

// load the express module
var app = express();

// configure port (default: 8002)
app.set('port', process.env.PORT || 8002);

// express configuration
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// required by express before opening session
app.use(express.cookieParser('secret'));
app.use(express.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.use(express.errorHandler());

// load app models and app routes
var models = require('./models')(app);
require('./routes')(app);

//require soundcloud utility
var utils = require('./utils')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});