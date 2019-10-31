//TODO: gaming tweets with video, jumbled tweets,
// Our Twitter library
var Twit = require('twit');
const fs = require('fs');


// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var searchItem = {q: "#gaming", count: 100, result_type: "mixed"};

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
var hasRun = false;
function getTweetData() {
	T.get('search/tweets', searchItem, function (error, data) {
		console.log('retrieved ' + data.search_metadata.count + ' ' + data.search_metadata.query + ' tweets');
		if (!error) {
			console.log('returned data');
			// tweetData = data;

			write(data.statuses);
			return data;

		} else {
			console.log('there was an error searching');
			return null;
		}
	});
}


// function retweetLatest() {
// 	T.get('search/tweets', searchItem, function (error, data) {
// 	  // log out any errors and responses
// 	  console.log(error, data);
// 	  // If our search request to the server had no errors...
// 	  if (!error) {
// 	  	// ...then we grab the ID of the tweet we want to retweet...
// 		tweetData = data;
// 		var tweetId = tweetData.statuses[0].id_str;
// 		var text = scramble(tweetData.statuses[0].text);
// 		// ...and then we tell Twitter we want to retweet it!
//
//         // T.post('statuses/update', {status: text}, data.statuses[0], function(error, data, response) {console.log(data)});
// 	  }
// 	  // However, if our original search request had an error, we want to print it out here.
// 	  else {
// 	  	console.log('There was an error with your hashtag search:', error);
// 	  }
// 	});
// }

function scramble(text) {

	stringArray = text.split(" ");
	var newStringArray = [""];

	var iterations = stringArray.length;

	var i;
	for(i = 0; i < iterations; i++) {

		var index = Math.floor(Math.random() * stringArray.length);
		//maybe filtering links? if substring works the same way in JS
		if(!(stringArray[index].substring(0, min(3, stringArray[index].length())).equals('http') || stringArray[index].substring(0, min(5, stringArray[index].length())).equals('bit.ly'))) {
			newStringArray.push(stringArray[index]);
		}

		stringArray.splice(index, 1);
		console.log('added ' + newStringArray[newStringArray.length - 1]);

	}

	newText = "";

	for (var i = 0; i < newStringArray.length - 1; i++) {
		newText += (newStringArray[i] + " ");
	}

	var newText = "";
	for(str of newStringArray) {
		newText += (str + " ");
	}
	newText = newText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	return newText + "?";
}

function write(tweets) {
	var corpus = "";
	for(tweet of tweets) {
		console.log('added' + tweet.text);
		corpus += tweet.text;
	}
	fs.writeFile('corpus.txt', corpus, (err) => {
		if(err) throw err;
		else console.log('wrote corpus');
	});
}

function min(a, b) {
	if(a < b) {
		return a;
	} else {
		return b;
	}
}

// Try to retweet something as soon as we run the program...
// retweetLatest();
var things = getTweetData();
console.log(things);
if(hasRun) {
	write(things.statuses);
}
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
// setInterval(retweetLatest, 1000 * 60 * 60);
