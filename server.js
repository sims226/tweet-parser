// DEPENDENCIES
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var Twitter = require('twitter');
var express = require('express');
var app = express();

// VARIABLES TO STORE TWEET COUNTS
var commas        = 0;
var periods       = 0;
var questions     = 0;
var exclamations  = 0;
var dashes        = 0;
var colons        = 0;
var semicolons    = 0;
var apostrophes   = 0;

// EXPRESS BASE
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.listen(app.get('port'), function() {
  console.log('Parse du Tweets running on ', app.get('port'));
});

app.get('/', function(req, res) {
  res.render('index', {
        periods: periods,
        commas: commas,
        questions: questions,
        exclamations: exclamations,
        dashes: dashes,
        colons: colons,
        semicolons: semicolons,
        apostrophes: apostrophes
  });
});

// LOAD ENV VARIABLES
dotenv.load();

// MAKE A TWITTER CLIENT
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// GRAB LAST 100 TWEETS
client.get('statuses/user_timeline', {screen_name: 'sheaj21', count: 100, trim_user: true}, function(error, tweets, response) {
  if(error) throw error;

  // LOOP OVER RESPONSE OBJECT AND PUSH TWEET TEXT INTO NEW ARRAY
  var tweetsArray = [];
  for(var i = 0; i < tweets.length; i++) {
    tweetsArray.push(tweets[i].text);
    // console.log((i + 1) + ": " + tweetsArray[i] + "\n");
  }

  // COUNT ALL THE PUNCTUATION IN THE TWEETS AND COUNT THE RESULTS
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
});
