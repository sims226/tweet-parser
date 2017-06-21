// REQUIRED NODE MODULES
var dotenv = require('dotenv');
var Twitter = require('twitter');

// LOAD ENV VARIABLES
dotenv.load();

// MAKE A TWITTER CLIENT
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// GRAB LAST 100 TWEETS FROM USER TIMELINE AND DO STUFF TO THEM
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
  console.log("_______________________\n");
  console.log("YOUR PUNCTUATION COUNTS\r");
  console.log("_______________________\r");
  console.log("\n");
  console.log("PERIODS: " + periods);
  console.log("COMMAS: " + commas);
  console.log("QUESTIONS: " + questions);
  console.log("EXCLAMATIONS: " + exclamations);
  console.log("DASHES: " + dashes);
  console.log("COLONS: " + colons);
  console.log("SEMICOLONS: " + semicolons);
  console.log("APOSTROPHES: " + apostrophes);
});
