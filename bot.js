//TODO: gaming tweets with video, jumbled tweets,
// Our Twitter library
const Twit = require('twit');
const Markov = require('markov-strings').default;

const options = {
    maxTries: 1000,
    prng: Math.random,
    filter: (result) => {
        return result.string.split(' ').length >= 10;
    }
}

//filesync to write for the markov library
const fs = require('fs');


// We need to include our configuration file
const T = new Twit(require('./config.js'));

var corpus2;

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var searchItem = {q: "#gaming", count: 100, result_type: "mixed"};

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.

var generatedText;

function corpusTweet() {
	T.get('search/tweets', searchItem, async function (error, data) {
		console.log('retrieved ' + data.search_metadata.count + ' ' + data.search_metadata.query + ' tweets');
		if (!error) {
			console.log('returned data');
			// tweetData = data;

			write(data.statuses);

			const markov = new Markov(corpus2.split('\n'), {stateSize: 1});
			markov.buildCorpus();
			try {
				generatedText = markov.generate(options).string;
                console.log(generatedText);
                post(generatedText, data);
			} catch (error) {
				console.error(error);
			}

		} else {
			console.log('there was an error searching');
			return null;
		}
	});
}

function scrambleTweet() {
	T.get('search/tweets', searchItem, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		tweetData = data;
		var tweetId = tweetData.statuses[0].id_str;
		var text = scramble(tweetData.statuses[0].text);
		// ...and then we tell Twitter we want to retweet it!

        post(text, data);
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

//reorder words of tweets, remove punctuation, but keep quoted tweet link at the end
function scramble(text) {
  //we split the tweet into an array of strings
	stringArray = text.split(" ");
	var newStringArray = [""];

	var iterations = stringArray.length;

	var i;
	for(i = 0; i < iterations - 1; i++) {

		var index = Math.floor(Math.random() * (stringArray.length - 1));
		//Filter out external links
		console.log(stringArray[index] + ' ' + index);
		if(stringArray[index].length >= 4) {
			let httpCheck = stringArray[index].substring(0, 3);

			if(!(httpCheck == "http")) {
				newStringArray.push(stringArray[index]);
				stringArray.splice(index, 1);
				// console.log('added ' + newStringArray[newStringArray.length - 1]);
			}
		} else {
			newStringArray.push(stringArray[index]);
			stringArray.splice(index, 1);
		}
	}

	//reconstruct string from randomized array
	var newText = "";

  //turn the new array we made into a string without the last item, since that's a link.
	for (var i = 0; i < newStringArray.length - 1; i++) {
		newText += (newStringArray[i] + " ");
	}

	newText = newText.replace(/[.,\/!$%\^&\*;:{}=\-_`~()@]/g,"");

	newText += "? ";
	newText += stringArray[stringArray.length - 1];
	return newText;
}

function min(a, b) {
	if(a < b) {
		return a;
	}
	return b;
}

function post(text, data) {
    T.post('statuses/update', {status: text}, data.statuses[0], function(error, data, response) {
        if(error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
    console.log('tweeted');
    // process.exit(0);
}

function continueExec(text, data) {
    if(generatedText == null) {
        setTimeout(continueExec(text, data), 1000);
        return;
    }
    post(text, data);
}

function write(tweets) {
	for(tweet of tweets) {
		// console.log('added' + tweet.text);
		corpus2 += tweet.text;
	}
	fs.writeFile('corpus.txt', corpus2, (err) => {
		if(err) throw err;
		else console.log('wrote corpus');
	});
}

function runBot() {
    var num = Math.random();
    if(num < 0.5) {
        corpusTweet();
    } else {
        scrambleTweet();
    }
}

// Try to retweet something as soon as we run the program...
// retweetLatest();
// getTweetData();


// console.log(things);
// if(hasRun) {
// 	write(things.statuses);
// }
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
// setInterval(retweetLatest, 1000 * 60 * 60);
