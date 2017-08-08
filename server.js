// DEPENDENCIES
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var express = require('express');
var expressValidator = require('express-validator');
var Twitter = require('twitter');

// EXPRESS BASE
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // TODO:consider eliminating

app.listen(app.get('port'), function() {
  console.log('Parse du Tweets running on ', app.get('port'));
});

// ENV VARIABLES
dotenv.load();

// INDEX ROUTE
app.get('/', function(req, res) {
  res.render('index');
});

// ACCEPT USER INPUT AND START THE BIZNISS
app.post('/', function(req, res){
  var userInput     = req.body.userInput;
  var commas        = 0;
  var periods       = 0;
  var questions     = 0;
  var exclamations  = 0;
  var dashes        = 0;
  var semicolons    = 0;
  var apostrophes   = 0;

  console.log(userInput + " is your Twitter screen name.");

  // BEGIN THE TWITTER PART
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  // GRAB LAST 100 TWEETS
  client.get('statuses/user_timeline', {screen_name: userInput, count: 100, trim_user: true}, function(error, tweets, response) {
    if(error) throw res.render('error', {
      code: error[0].code,
      message: error[0].message
    });
      // TODO redirect to error page

    // LOOP OVER RESPONSE OBJECT AND PUSH TWEET TEXT INTO NEW ARRAY

    // TODO: consolidate using for...in per Jesse ex

    var tweetsArray = [];
    for(var i = 0; i < tweets.length; i++) {
      tweetsArray.push(tweets[i].text);
    }

    // COUNT ALL THE PUNCTUATION IN THE TWEETS AND STORE THE RESULTS
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
          case ";"  :
            semicolons++;
            break;
          case "'"  :
            apostrophes++;
            break;
        }
      }
    });
    // PASS PUNCTUATION COUNTS TO THE FRONT AND RENDER
    res.render('results', {
          userInput: userInput,
          periods: periods,
          commas: commas,
          questions: questions,
          exclamations: exclamations,
          dashes: dashes,
          semicolons: semicolons,
          apostrophes: apostrophes
    });
    // consider redirect to /results endpoint
  });
});
