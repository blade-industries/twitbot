//TODO: gaming tweets with video, jumbled tweets,
// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mediaArtsSearch = {q: "#gaming", count: 10, result_type: "recent"};

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var tweetId = data.statuses[0].id_str;
		var text = scramble(data.statuses[0].text);
		// ...and then we tell Twitter we want to retweet it!

        T.post('statuses/update', {status: text}, function(error, data, response) {console.log(data)});
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

function scramble(var text) {
	var newText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	stringArray = newText.split(" ");
	var iterations = stringArray.length;
	var newStringArray;
	var i;
	for(i = 0; i < iterations; i++) {
		var index = Math.floor(Math.random() * stringArray.length);
		newStringArray.push(stringArray[index]);
		stringArray.splice(index, 1);
	}
	newText = "";
	for(str of newStringArray) {
		newText += (str + " ");
	}
	return newText;
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
