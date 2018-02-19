'use strict';

const config = {
  'secrets': {
    'clientId': process.env.FOURSQUARE_APIKEY,
    'clientSecret': process.env.FOURSQUARE_SECRET,
    'redirectUrl': 'http://isisraelinjapan.com'
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
app.use(express.static(__dirname + '/assets'));

const checkLocation = () => {
  // Get friends recent checkins
  foursquare.Checkins.getRecentCheckins({}, foursquareAccessToken, function (err, checkins) {
    if (err) throw new Error(err);

    checkins.recent.forEach(function (checkin) {
      // Check if his most recent checkin was in Japan
      if (checkin.user.id == 354825) {
        return (checkin.venue.location.country == "Japan");
      }
    });
  });
  return false;
};

app.get('/', (req, res) => {
    var checkedIn = checkLocation();
    var isHeInJapan = 'No';
    if (checkedIn) isHeInJapan = 'Yes';
    res.render(__dirname + '/index', { isHeInJapan: isHeInJapan });
});

app.get('/api', (req, res) => {
  var checkedIn = checkLocation();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ is: checkedIn }));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
