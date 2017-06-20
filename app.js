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

// GRAB LAST MONTH'S TWEETS FROM USER TIMELINE AND DO STUFF TO THEM
client.get('statuses/user_timeline', {screen_name: 'twitterdev', count: 1}, function(error, tweets, response) {
  if(error) throw error;
  console.log(tweets[0].text);

});
