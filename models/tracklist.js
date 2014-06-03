//get favorites stream by profile name
exports.convertSoundcloudTracklist = function (tracklistJSON) {
	var tracks = [];
	for (var i = 0; i < tracklistJSON.length; i++) {
	    tracks[i] = {
	    	id: tracklistJSON[i].id,
	    	title: tracklistJSON[i].title,
	    	//description: tracklistJSON[i].description,
	    	stream_url: tracklistJSON[i].stream_url,
	    	cover: tracklistJSON[i].artwork_url
	    };
	}
	console.log(JSON.stringify(tracks, null, 10));
	return JSON.stringify(tracks, null, "");
	//return tracklistJSON;
};

