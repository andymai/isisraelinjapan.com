'use strict';

const config = {
	secrets: {
		clientId: process.env.FOURSQUARE_APIKEY,
		clientSecret: process.env.FOURSQUARE_SECRET,
		redirectUrl: 'http://isisraelinjapan.com'
	},
	foursquare: {
		version: '20140806',
		mode: 'swarm',
	}
};
// Use your account's OAUTH token. You need to be friends with Israel.
const foursquareAccessToken = process.env.FOURSQUARE_TOKEN;

const foursquare = require('node-foursquare')(config);
const express = require('express');
const path = require('path');

// Constants
const PORT = 4000;
const HOST = '0.0.0.0';

// App
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/assets')));

app.get('/', (req, res) => {
	foursquare.Users.getDetails('354825', foursquareAccessToken, (err, details) => {
		let answer = 'No'
		if (err) throw new Error(err);

		if (details.user.checkins.items[0].venue.location.country === 'Japan') {
			answer = 'Yes'
		} 

		res.render(path.join(__dirname, '/index'), {
			isHeInJapan: answer
		});
	})
});

app.get('/api', (req, res) => {
	foursquare.Users.getDetails('354825', foursquareAccessToken, (err, details) => {
		let answer = 'No'
		if (err) throw new Error(err);

		if (details.user.checkins.items[0].venue.location.country === 'Japan') {
			answer = 'Yes'
		} 
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({
			is: answer
		}));
	})
});

app.listen(PORT, HOST, function () {
	console.log(`Running on http://${HOST}:${PORT}`);
});