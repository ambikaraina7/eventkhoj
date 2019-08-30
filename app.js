const express = require('express')
const app = express()
var cors = require('cors');
const port = 8081

const http = require('http');
const request = require('request');

const router = express.Router();

fs = require('fs');
var bodyParser = require('body-parser');
var geohash = require('ngeohash');
var moment = require('moment');

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: 'eb6ecbda066541539b1a756866dd38ca',
  clientSecret: 'f2f158bb445640de84aa76c0b581da9e'
});

app.use(cors());
app.get('/artistdetail', function(req, res) {

	var artistName = req.query.artist_name;
	


	// Search artists whose name contains artistName
	spotifyApi.searchArtists(artistName)
	  .then(function(data) {
	    console.log('Search artists by "artistName"', data.body.artists.items[0].name);
	    data.body.currentartist = artistName;
	    res.send(data.body);
	  }, function(err) {
	    console.error(err);
	    // Retrieve an access token.
		spotifyApi.clientCredentialsGrant().then(
		  function(data) {
		    console.log('The access token is ' + data.body['access_token']);

		    spotifyApi.setAccessToken(data.body['access_token']);

		    spotifyApi.searchArtists(artistName)
			  .then(function(data) {
	    		console.log('Search artists by "artistName"', data.body.artists.items[0].name);
	    		data.body.currentartist = artistName;
			    res.send(data.body);
			  }, function(err) {
			    console.error(err);
			  });

		  },
		  function(err) {
		    console.log('Something went wrong when retrieving an access token', err);
		  }
		);
	  });

});

app.get('/artistphoto', function(req, res) {

	var artistName = encodeURIComponent(req.query.artist_name);

	var ap_url ="https://www.googleapis.com/customsearch/v1?q="+ artistName +"&cx=012576778016476224643:yyh7rb_xx5g&imgSize=huge&num=8&searchType=image&key=AIzaSyA0VXCXL_7xUeMzkaI0i1cg0g8f-ol6OaQ";
	console.log("Artist photo url: " + ap_url);
	request(ap_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body); // Print the web page.

	    var res_ap = JSON.parse(body);

	    // console.log(res);
	    res.send(res_ap);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in artist photo - google custom search");
	  }
	});
	
});

app.use(bodyParser.urlencoded({ extended: true })); 

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.get('/autocomplete', function(req, res) {

	var searchText = encodeURIComponent(req.query.searchText);

	var ac_url ='https://app.ticketmaster.com/discovery/v2/suggest?apikey=XZrWsBik9J3uusheMIT3SvI04D8ZjkVt&keyword=' + searchText;
	console.log("Autocomplete url: " + ac_url);
	request(ac_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	    var res_ac = JSON.parse(body);

	    res.send(res_ac);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in autocomplete");
	  }
	});
	
});


app.get('/geocode', function(req, res) {

	var locationtb = encodeURIComponent(req.query.locationtb);

	var gc_url ="https://maps.googleapis.com/maps/api/geocode/json?address=" + locationtb + "&key=AIzaSyCtS0apTWJBGQseMZqbfoFH6Apa-oSTldE";
	console.log("Geocode url: " + gc_url);
	request(gc_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body); // Print the web page.

	    var res_gc = JSON.parse(body);

	    // console.log(res);
	    res.send(res_gc);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in geocode");
	  }
	});
	
});


app.get('/eventsearch', function(req, res){
	// var obj = {};
	// console.log('body: ' + JSON.stringify(req.body));
	// console.log('keyword: ' + JSON.stringify(req.keyword));
	// var work = req.query.keyword;
	console.log(req.route.path);
	console.log("keyword" + encodeURIComponent(req.query.keyword));
	console.log("category " +req.query.category);
	console.log("distance" + req.query.distance);
	console.log("disMode" + req.query.disMode);
	console.log("location_rb" + req.query.location_rb);
	// console.log(req.query.curr_loc);
	// console.log(req.query.other_loc);
	console.log("locationtb" + req.query.locationtb);
	console.log("lat" + req.query.latitude);
	console.log("lon" + req.query.longitude);
	// res.send(req.body);

	var keyword = encodeURIComponent(req.query.keyword);
	var category = req.query.category;
	var distance = req.query.distance;
	if (distance == 'undefined')
		distance = '10';
	var disMode = req.query.disMode;
	var curr_loc = req.query.curr_loc;
	var other_loc = req.query.other_loc;
	var locationtb = req.query.locationtb;
	if (locationtb == 'undefined')
		locationtb = '';
	var lat = req.query.latitude;
	var lon = req.query.longitude;

	var segmentid;

	if (category == "Music")
		segmentid="KZFzniwnSyZfZ7v7nJ";
	else if (category == "Sports")
		segmentid="KZFzniwnSyZfZ7v7nE";
	else if (category == "Arts & Theatre")
		segmentid="KZFzniwnSyZfZ7v7na";
	else if (category == "Film")
		segmentid="KZFzniwnSyZfZ7v7nn";
	else if (category == "Miscellaneous")
		segmentid="KZFzniwnSyZfZ7v7n1";
	else if (category == "All")
		segmentid="";

	if(distance == "")
		distance =10;


	console.log(geohash.encode(lat,lon));
	geohashcode = geohash.encode(lat,lon);


	
	console.log("keyword" + keyword);
	var tm_url ='https://app.ticketmaster.com/discovery/v2/events.json?apikey=XZrWsBik9J3uusheMIT3SvI04D8ZjkVt&keyword=' + keyword + '&sort=date,asc&geoPoint=' + geohashcode + '&radius=' + distance + '&unit=' + disMode +'&segmentId=' + segmentid;
	console.log(tm_url);
	request(tm_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body); // Print the web page.

	    var res_msg = JSON.parse(body);

	    // console.log(res);
	    res.json(res_msg);
	    console.log("\n");
	    console.log(req.route.path);
	  }
	  else{
	  	console.log("error");
	  }
	});
	
});

app.get('/eventdetails', function(req, res) {

	var ev_id = encodeURIComponent(req.query.e_id);
	console.log("Event ID: " + ev_id);

	var ev_url ="https://app.ticketmaster.com/discovery/v2/events/" + ev_id + "?apikey=XZrWsBik9J3uusheMIT3SvI04D8ZjkVt";
	console.log("Event Details url: " + ev_url);
	request(ev_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	    var res_ev = JSON.parse(body);

	    // console.log(res);
	    res.send(res_ev);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in event details");
	  }
	});
	
});


app.get('/venuedetails', function(req, res) {

	var ev_venue = encodeURIComponent(req.query.venue_name);
	console.log("Event Venue: " + ev_venue);

	var ven_url ="https://app.ticketmaster.com/discovery/v2/venues.json?keyword=" + ev_venue + "&apikey=XZrWsBik9J3uusheMIT3SvI04D8ZjkVt";
	console.log("Event Details url: " + ven_url);
	request(ven_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	    var res_ven = JSON.parse(body);

	    // console.log(res);
	    res.send(res_ven);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in venue details");
	  }
	});
	
});


app.get('/searchvenue', function(req, res) {

	var venue_sk = encodeURIComponent(req.query.venue_name);
	console.log("(songkick call 1)Event Venue: " + venue_sk);


	var sk_ven_url ="https://api.songkick.com/api/3.0/search/venues.json?query=" + venue_sk + "&apikey=p4weaPELtQuGukqu";
	console.log("Event Details url: " + sk_ven_url);
	request(sk_ven_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	    var res_ven_sk = JSON.parse(body);

	    // console.log(res);
	    res.send(res_ven_sk);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in search venue - songkick(call 1)");
	  }
	});
	
});

app.get('/upcomingevents', function(req, res) {

	var ven_id_sk = encodeURIComponent(req.query.venue_id);
	console.log("(songkick call 2)Event Id: " + ven_id_sk);



	var sk2_ven_url ="https://api.songkick.com/api/3.0/venues/" + ven_id_sk + "/calendar.json?apikey=p4weaPELtQuGukqu";
	console.log("Event Details url: " + sk2_ven_url);
	request(sk2_ven_url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	    var res_ven_sk2 = JSON.parse(body);

	    // console.log(res);
	    res.send(res_ven_sk2);
	    console.log("\n");
	  }
	  else{
	  	console.log("error in upcoming events - songkick(call 2)");
	  }
	});
	
});


