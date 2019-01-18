var express = require("express");
var cors = require("cors");
var geohash = require('ngeohash');
var http = require("http");
var https = require("https");
const path = require('path');
// const port = process.env.Port || 8081;

var app = express();
// solve the problem of cors
app.use(cors());



var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: '8d9a5b859b5e446cb0aec4f29e0ba2d9',
  clientSecret: '3097685a215d4e27aab8d66f2f08a2c3',
  // redirectUri: 'http://www.example.com/callback'
});
//GET request for spotify service
app.get("/spotifyApi", function(req, res) {
    let name = req.query.name;
    console.log(name);
    //Attemp to get an artist
    spotifyApi.searchArtists(name).then(
        function(data) {
            console.log('The access_token has not expired');
            console.log(`Search artists by ${name}`, data.body);
            res.json(data.body);
        }, 
        function(err) {
            console.error(err);
            // If error happens, then it means the access_token may has expired
            // So need to get an access token and 'save' it using a setter
            spotifyApi.clientCredentialsGrant().then(
              function(data) {
                console.log('The access token is ' + data.body['access_token']);
                spotifyApi.setAccessToken(data.body['access_token']);
                //After create the new token, do search again!!!
                spotifyApi.searchArtists(name).then(
                    function(data) {
                        console.log(`Search artists by $love`, data.body);
                        res.json(data.body);
                    }, 
                    function(err) { 
                        console.log(err);
                        res.status(err.statusCode);
                        // res.send(err.statusCode);
                        res.json(err.statusCode);
                        // res.status(400);
                    }
                );
              },
              function(err) {
                console.log('Something went wrong!', err);
              }
            );
        }
    );
});


//GET request for artist team(s) service
app.get("/getArtistTeamsApi", function(req, res) {
    let query = req.query; 
    console.log('query', query);
    let apiKey = "AIzaSyDqd7pBkC1g7ysVENuqjkQDBYhGWJviu-M";
    let MY_SEARCH_ENGINE_ID = "017776930278243185753:jmmprwayg0q";
    let getArtistTeamsApiPrefix = "https://www.googleapis.com/customsearch/v1";
    let parameterArr = [
                        ['q', query.name],
                        ['cx', MY_SEARCH_ENGINE_ID],
                        ['imgSize','huge'],
                        ['imgType', 'news'],
                        ['num', 8],
                        ['searchType','image'],
                        ['key', apiKey]
                       ];
    console.log(appendParameter(getArtistTeamsApiPrefix, parameterArr));
    let options = createOptions("www.googleapis.com", 443, "/customsearch/v1", "GET", parameterArr);
    getJSON(options, function(statusCode, json) {

        console.log('GET request for artist team(s) service status: ', statusCode);
        res.statusCode = statusCode;
        res.send(json);
    });
});


//GET request for event search service
app.get("/autoCompleteApi", function(req, res) {
    let query = req.query; 
    let apiKey = "jL9PDGSNDgl58VWor05YYs7LP8tMWrto";
    let autoCompleteApiPrefix = "https://app.ticketmaster.com/discovery/v2/suggest";
    let parameterArr = [
                        ['keyword', query.keyword],
                        ['apikey', apiKey]
                       ];
    console.log(appendParameter(autoCompleteApiPrefix, parameterArr));
    let options = createOptions("app.ticketmaster.com", 443, "/discovery/v2/suggest", "GET", parameterArr);
    getJSON(options, function(statusCode, json) {
        console.log('GET request for autoComplete service status: ', statusCode);
        res.statusCode = statusCode;
        res.send(json);
    });
});

//GET request for event search service
app.get("/eventSearchApi", function(req, res) {
    let query = req.query;  

    //get geoHash 
    let lat = undefined;
    let lon = undefined; 
    console.log('query.locationIndex',query.locationIndex);
    // if (query.location === '') {
    if (query.locationIndex === '0') {
        lat = query.userLat;
        lon = query.userLon;

        let geoHash = getGeoHash(lat, lon);
        let segmentId = getSegmentId(query.category);
        let apiKey = "jL9PDGSNDgl58VWor05YYs7LP8tMWrto";
        let eventSearchApiPrefix = "https://app.ticketmaster.com/discovery/v2/events.json";
        let parameterArr = [
                       ['keyword', query.keyword],
                       ['segmentId', segmentId],
                       ['radius', query.distance],
                       ['unit', query.unit],
                       ['geoPoint', geoHash],
                       ['sort','date,asc'], //ascending order by date!!!!
                       ['apikey', apiKey]
                      ];

        //test api 
        console.log(appendParameter(eventSearchApiPrefix, parameterArr));
        let options = createOptions("app.ticketmaster.com", 443, "/discovery/v2/events.json", "GET", parameterArr);
        
        getJSON(options, function(statusCode, json) {
            // I could work with the result html/json here.  I could also just return it
            // console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
            // res.send(result);
            console.log('GET request for event search service status: ', statusCode);
            res.statusCode = statusCode;
            res.send(json);
        });
    }
    else {
        let google_geocode_prefix = "https://maps.googleapis.com/maps/api/geocode/json";
        let google_geocode_apiKey = "AIzaSyDqd7pBkC1g7ysVENuqjkQDBYhGWJviu-M";
        let google_geocode_parameterArr = [
                            ["address",query.location],
                            ["key",google_geocode_apiKey]
                           ];
        let google_geocode_options = createOptions("maps.googleapis.com", 443, "/maps/api/geocode/json", "GET", google_geocode_parameterArr);
        console.log(appendParameter(google_geocode_prefix, google_geocode_parameterArr));

        let locationObject = undefined;

        getJSON(google_geocode_options, function(statusCode, json) {
            // I could work with the result html/json here.  I could also just return it
            // console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
            // res.send(result);
            console.log('GET request for google geocode service status: ', statusCode);
            locationObject = json;
            console.log('locationObject1', locationObject);
            lat = locationObject["results"][0]["geometry"]["location"]["lat"];
            lon = locationObject["results"][0]["geometry"]["location"]["lng"];

            let geoHash = getGeoHash(lat, lon);
            let segmentId = getSegmentId(query.category);
            let apiKey = "jL9PDGSNDgl58VWor05YYs7LP8tMWrto";
            let eventSearchApiPrefix = "https://app.ticketmaster.com/discovery/v2/events.json";
            let parameterArr = [
                           ['keyword', query.keyword],
                           ['segmentId', segmentId],
                           ['radius', query.distance],
                           ['unit', query.unit],
                           ['geoPoint', geoHash],
                           ['sort','date,asc'], //ascending order by date!!!!
                           ['apikey', apiKey]
                          ];

            //test api 
            console.log(appendParameter(eventSearchApiPrefix, parameterArr));
            let options = createOptions("app.ticketmaster.com", 443, "/discovery/v2/events.json", "GET", parameterArr);
            
            getJSON(options, function(statusCode, json) {
                // I could work with the result html/json here.  I could also just return it
                // console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
                // res.send(result);
                console.log('GET request for event search service status: ', statusCode);
                res.statusCode = statusCode;
                res.send(json);
            });
        });

    }

    // var port = options.port == 443 ? https : http;
    // //Asyn
    // port.request(options, function(result)
    // {
    //     var output = '';
    //     console.log(options.hostname + ':' + res.statusCode);
    //     result.setEncoding('utf8');

    //     result.on('data', function (chunk) {
    //         output += chunk;
    //     });

    //     result.on('end', function() {
    //         res.json(output);
    //     });
    // }).end();
});


//GET request for event detail service
app.get("/getEventDetailApi", function(req, res) {
    let query = req.query; 
    console.log('query', query);
    let apiKey = "jL9PDGSNDgl58VWor05YYs7LP8tMWrto";
    let getEventDetailApiPrefix = "https://app.ticketmaster.com/discovery/v2/events/" + query.eventId;
    let parameterArr = [
                        ['apikey', apiKey]
                       ];
    console.log(appendParameter(getEventDetailApiPrefix, parameterArr));
    let options = createOptions("app.ticketmaster.com", 443, "/discovery/v2/events/" + query.eventId, "GET", parameterArr);
    getJSON(options, function(statusCode, json) {

        console.log('GET request for event detail service status: ', statusCode);
        res.statusCode = statusCode;
        res.send(json);
    });
});

//GET request for venue detail service
app.get("/getVenueDetailApi", function(req, res) { 
    let query = req.query; 
    console.log('query', query);
    let apiKey = "jL9PDGSNDgl58VWor05YYs7LP8tMWrto";
    let getVenueDetailApiPrefix = "https://app.ticketmaster.com/discovery/v2/venues";
    let parameterArr = [
                        ['keyword', query.keyword],
                        ['apikey', apiKey]
                       ];
    console.log(appendParameter(getVenueDetailApiPrefix, parameterArr));
    let options = createOptions("app.ticketmaster.com", 443, "/discovery/v2/venues", "GET", parameterArr);
    getJSON(options, function(statusCode, json) {

        console.log('GET request for venue detail service status: ', statusCode);
        res.statusCode = statusCode;
        res.send(json);
    });
});


//GET request for songkick detail service
app.get("/getSongkickDetailApi", function(req, res) { 
    let query = req.query; 
    console.log('query', query);
    let apiKey = "rRKI5k01Ktzsx5ba";
    let songkickApiPrefix = "https://api.songkick.com/api/3.0/search/venues.json";
    let parameterArr = [
                        ['query', query.query],
                        ['apikey', apiKey]
                       ];
    console.log(appendParameter(songkickApiPrefix, parameterArr));
    let options = createOptions("api.songkick.com", 443, "/api/3.0/search/venues.json", "GET", parameterArr);
    getJSON(options, function(statusCode, json) {

        console.log('GET request for songkick detail service status: ', statusCode);
        // console.log(json["resultsPage"]["results"]["venue"][0]["id"]);

        try {
            let id = json["resultsPage"]["results"]["venue"][0]["id"];
            let apiKey = "rRKI5k01Ktzsx5ba";
            let songkickApiPrefix = "https://api.songkick.com/api/3.0/venues/" + id + "/calendar.json";
            let parameterArr = [
                                ['apikey', apiKey]
                               ];
            console.log(appendParameter(songkickApiPrefix, parameterArr));

            let options = createOptions("api.songkick.com", 443, "/api/3.0/venues/" + id + "/calendar.json" , "GET", parameterArr);
            getJSON(options, function(statusCode, json) { 
                res.statusCode = statusCode;
                res.send(json);
            });
        } catch (error) {
            let result = [];
            res.json(result);
            console.log('error[try to get the venue id]', error);
        }

    });
});

//callback ------ result(statusCode, json)
function getJSON(options, result)
{
    var port = options.port == 443 ? https : http;
    //Asyn
    var req = port.request(options, function(res)
    {
        var responseBody = '';
        console.log(options.hostname + ':' + res.statusCode);
        res.setEncoding('UTF-8');

        res.once('data', function (chunk) {
            // console.log(chunk);
        });

        res.on('data', function (chunk) {
            responseBody += chunk;
            console.log(`--chunk-- ${chunk.length}`);
        });

        res.on('end', function() {
            result(res.statusCode, JSON.parse(responseBody)); // return status and json back to result!!!!!!!!
        });
    });

    // console.log("req", req);
    req.on('error', function(err) {
        console.log(`error with request api 
            => ${options.port}://${options.hostname}${options.path}
            => ${err,message}
        `);
    });

    req.end(); // end is a must!!!
};


function appendParameter (prefix, parameterArr) {
    prefix += "?";
    for (let index in parameterArr) {
        //url encode even though front has already encodeURIComponent,
        //there is a automatic decode process from front => end
        prefix += parameterArr[index][0] + "=" + encodeURIComponent(parameterArr[index][1]) + "&";
    }
    prefix = prefix.substr(0, prefix.length - 1);
    return prefix;
}


function createOptions (hostNmae, portNumber, pathName, methodName, parameterArr) {
    pathName = appendParameter(pathName, parameterArr);
    let option = {
        hostname : hostNmae,
        port : portNumber,
        path: pathName,
        method: methodName,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return option;
}

/**
 * @param  {[string]} category name
 * @return {[string]} segmentId
 */
function getSegmentId(category) { 
    segmentObj = {
        "All" : "", 
        "Music" : "KZFzniwnSyZfZ7v7nJ", 
        "Sports" : "KZFzniwnSyZfZ7v7nE", 
        "Arts & Theatre" : "KZFzniwnSyZfZ7v7na",  
        "Film" : "KZFzniwnSyZfZ7v7nn", 
        "Miscellaneous" : "KZFzniwnSyZfZ7v7n1"
    }
    return segmentObj[category];
}


/**
 * @param  {[string]}
 * @param  {[string]}
 * @return {[string]} geohash
 */
function getGeoHash(lat, lon) {
  return geohash.encode(lat, lon);
}

/**
 * @param  {[string]} url without key appended
 * @param  {[number]} 1 => Google Maps Geocoding API 
 *                    2 =>
 * @return {[string]} url with key appended 
 */
function appendApiKey(url, mode) {
	// let googleGeocodePrefix = "https://maps.googleapis.com/maps/api/geocode/json?";
  if (mode == 1) {
    let googleGeocodeApiKey = "AIzaSyDqd7pBkC1g7ysVENuqjkQDBYhGWJviu-M";
    url += "key" + "=" + googleGeocodeApiKey;
  }

  return url;
}

// app.use(express.static("./hw8"));
app.use(express.static("./hw8"));
app.get('/',(req,res)=> {
    res.sendFile("./hw8/index.html", {root:__dirname});
});

// app.get('/',(req,res)=> {
//     res.sendFile("./public/hw8/src/index.html", {root:__dirname});
// });

// app.use(express.static(_dirname))

// app.use(express.static("./public/hw8/src"));
app.listen(8081);
console.log("Listening on port 8081");