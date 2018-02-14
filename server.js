'use strict';

const config = {
  'secrets': {
    'clientId': process.env.FOURSQUARE_APIKEY,
    'clientSecret': process.env.FOURSQUARE_SECRET,
    'redirectUrl': 'http://isisraelinjapan.com'
  }
}
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

app.get('/', (req, res) => {

  // Get friends recent checkins
  foursquare.Checkins.getRecentCheckins({ }, foursquareAccessToken, function (err, checkins) {
    if (err) throw new Error(err);

    var isHeInJapan = 'No'; // Default No

    checkins.recent.forEach(function(checkin) {
      // Check if his most recent checkin was in Japan
      if ((checkin.user.id = 354825) && (checkin.venue.location.country = "Japan")) {
        isHeInJapan = 'Yes';
        return true;
      }
    })
    res.render(__dirname + '/index', { isHeInJapan: isHeInJapan });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
