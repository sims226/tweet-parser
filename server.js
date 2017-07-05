// MODULE DEPENDENCIES
var dotenv = require('dotenv');
var Twitter = require('twitter');
var fs = require("fs");
var path = require("path");
var mime = require("mime");

// LOAD ENV VARIABLES
dotenv.load();

// BASIC PAGE SERVING FUNCTIONALITY
function send404(response) {
  response.writeHead(404, {"Content-type" : "text/plain"});
  response.write("Error 404: resource not found");
  response.end();
}

function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

function serverWorking(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response);
        } else {
          sendPage(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}

// HTTP SERVER AND BASIC ROUTES
var server = http.createServer(function(request, response) {
  var filePath = false;

  if (request.url == '/') {
    filePath = "public/index.html";
  } else {
    filePath = "public" + request.url;
  }

  var absPath = "./" + filePath;
  serverWorking(response, absPath);
});

var port_number = server.listen(process.env.PORT || 3000);

// MAKE A TWITTER CLIENT
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// GRAB LAST 100 TWEETS
client.get('statuses/user_timeline', {screen_name: 'sims226', count: 100, trim_user: true}, function(error, tweets, response) {
  if(error) throw error;

  // LOOP OVER RESPONSE OBJECT AND PUSH TWEET TEXT INTO NEW ARRAY
  var tweetsArray = [];
  for(var i = 0; i < tweets.length; i++) {
    tweetsArray.push(tweets[i].text);
    // console.log((i + 1) + ": " + tweetsArray[i] + "\n");
  }

  // COUNT ALL THE PUNCTUATION IN THE TWEETS AND COUNT THE RESULTS
  var commas        = 0;
  var periods       = 0;
  var questions     = 0;
  var exclamations  = 0;
  var dashes        = 0;
  var colons        = 0;
  var semicolons    = 0;
  var apostrophes   = 0;

  tweetsArray.map( function(text) {
    for (var i = 0; i < text.length; i++) {
      switch (text[i]) {
        case "."  :
          periods++;
          break;
        case ","  :
          commas++;
          break;
        case "?"  :
          questions++;
          break;
        case "!"  :
          exclamations++;
          break;
        case "-"  :
          dashes++;
          break;
        case ":"  :
          colons++;
          break;
        case ";"  :
          semicolons++;
          break;
        case "'"  :
          apostrophes++;
          break;
      }
    }
  });

  // SEND RESULTS TO THE FRONT END
  app.get('/', function(req, res) {
    res.send(
      "HERE ARE YOUR PUNCTUATION COUNTS, MOTHERFUCKER >> " +
      "PERIODS: " + periods + " >> " +
      "COMMAS: " + commas + " >> " +
      "QUESTIONS: " + questions + " >> " +
      "EXCLAMATIONS: " + exclamations + " >> " +
      "DASHES: " + dashes + " >> " +
      "COLONS: " + colons + " >> " +
      "SEMICOLONS: " + semicolons + " >> " +
      "APOSTROPHES: " + apostrophes);
  });

  // router.get('/', function(req, res) {
  //   res.render('index', {
  //     periods: periods,
  //     commas: commas,
  //     questions: questions,
  //     exclamations: exclamations,
  //     dashes: dashes,
  //     colons: colons,
  //     semicolons: semicolons,
  //     apostrophes: apostrophes
  //    })
});
