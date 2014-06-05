// provides functionality to access the official soundcloud api

var https = require('https');
var qs = require('querystring');
var log = require("dysf.utils").logger;
var sc = exports;
	
// soundcloud uri's
var host_api = "api.soundcloud.com";
var oauth_path = "/oauth2/token";
var host_connect = "https://soundcloud.com/connect";

// authentication information
var client_id = "1658db91709a31648277029337106a74";
var client_secret = "8715282892a943e6c9472f27a098cf44";
var username = 'drdaveli@yahoo.de';
var password = 'jsoundcloud-downloader';

// oauth2 token that will be returned by soundcloud after successfull login
var oauth2_token = null;
var oauth2_code = null;

//--------------------------------------------

/* Make an API call
 *
 * @param {String} path
 * @param {Object} params
 * @param {Function} callback(error, data)
 * @return {Request}
 */
sc.get = function(path, params, callback, access_token) {
	call('GET', path, access_token, params, callback);
}

sc.post = function(path, params, callback, access_token) {
	call('POST', path, access_token, callback);
}

sc.put = function(path, params, callback, access_token) {
	call('PUT', path, access_token, params, callback);
}

sc.delete = function(path, params, callback, access_token) {
	call('DELETE', path, access_token, params, callback);
}

sc.getSoundcloudConnectURL = function(callback) {
	callback(undefined, host_connect + '?client_id=' + client_id + '&response_type=code&redirect_uri=http://localhost:8002/oauth-redirect');
}

sc.requestAccessToken = function(authorizationCode, callback) {
	var options = {  
		uri: host_api,  
		path: oauth_path,  
		method: 'POST', 
		qs: {  
			'client_id' : client_id,  
			'client_secret': client_secret,
			'grant_type': 'authorization_code',
			'redirect_uri': 'http://localhost:8002/oauth-redirect',
			'code': authorizationCode
		}
	};  
	  
	request(options, callback);
}

function call (method, path, access_token, params, callback) {
	if(path && path.indexOf('/') == 0)
	{
		if( typeof(params) == 'function' )
		{
			callback = params;
			params = {};
		}
		callback = callback || function() {};
		params = params || {};
		log.info('current access token: ' + access_token.access_token);
		params.oauth_token = access_token.access_token;
		params.format = 'json';
		return request({method: method, uri: host_api, path: path, qs: params}, callback);
	}
	else
	{
		callback({message: 'Invalid path: ' + path});
		return false;
	}
}

//--------------------------------------------


function request ( data, callback )
{	
	var qsdata = (data.qs) ? qs.stringify(data.qs) : '';
  	var options = {
  		hostname: data.uri,
  		path: data.path + '?' + qsdata,
  		method: data.method
  	};
  	
  	if(data.method == 'POST')
  	{
  		options.path = data.path;
		options.headers = {  
			'Content-Type': 'application/x-www-form-urlencoded',  
			'Content-Length': qsdata.length  
		};
  	}
  	
  	log.info("Attempting the following " + options.method + " Request: ");
  	log.info ("Host/Path: " + options.hostname + options.path);
  	log.info ("Parameters: " + qsdata);

  	var req = https.request(options, function (response) {
  		log.info("Request executed: " + options.method + '; ' + options.hostname + options.path);
  		log.info("Response http code: " + response.statusCode);
  		log.info("Response headers: " + JSON.stringify(response.headers));
  		
  		var body = "";
  		response.on('data', function(chunk) {
  			body += chunk;
  			//log.trace("chunk: " + chunk);
  		});
  		response.on('end', function() {
  			log.trace("Response body: " + body);
  			try
  			{
  				var d = JSON.parse(body);
  				// See http://developers.soundcloud.com/docs/api/guide#errors for full list of error codes
	  			if( response.statusCode != 200 )
  				{
  					log.error("SoundCloud API ERROR: " + response.statusCode);
  					callback(d.errors, d);
  				}
	  			else
  				{
  					log.trace("SoundCloud API OK: " + response.statusCode);
  					callback(undefined, d);
  				}
  			} catch(e)
  			{
  				callback(e);
  			}
  		});
	});
	
	req.on('error', function(e) {
	  	log.error("For Request: " + options.method + '; ' + options.hostname + options.path);
  		log.error("Request error: " + e.message);  
  		callback(e);	
  	});
  	
  	if(data.method == 'POST')
  	{
  		log.debug("POST Body: " + qsdata);
		req.write(qsdata);
  	}
  	
  	req.end();
}
  	  	
  	  	


