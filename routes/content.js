const express = require('express');
const router = express.Router();

const auth = require("../controllers/auth");


const Youtube = require("youtube-api")
, fs = require("fs")
, readJson = require("r-json")
, Lien = require("lien")
, Logger = require("bug-killer")
, opn = require("opn")
, prettyBytes = require("pretty-bytes")
;


router.post('/add', (req, res) => {

   /**
 * This script uploads a video (specifically `video.mp4` from the current
 * directory) to YouTube,
 *
 * To run this script you have to create OAuth2 credentials and download them
 * as JSON and replace the `credentials.json` file. Then install the
 * dependencies:
 *
 * npm i r-json lien opn bug-killer
 *
 * Don't forget to run an `npm i` to install the `youtube-api` dependencies.
 * */


// Init lien server
let server = new Lien({
host: "localhost"
, port: 3000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
type: "oauth"
, client_id: CREDENTIALS.web.client_id
, client_secret: CREDENTIALS.web.client_secret
, redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
access_type: "offline"
, scope: ["https://www.googleapis.com/auth/youtube.upload"]
}));

// Handle oauth2 callback
server.addPage("/oauth2callback", lien => {

Logger.log("Trying to get the token using the following code: " + lien.query.code);
oauth.getToken(lien.query.code, (err, tokens) => {

    if (err) {
        lien.lien(err, 400);
        return Logger.log(err);
    }

    Logger.log("Got the tokens.");

    oauth.setCredentials(tokens);

    lien.end("The video is being uploaded. Check out the logs in the terminal.");

    var req = Youtube.videos.insert({
        resource: {
            // Video title and description
            snippet: {
                title: "Test Video"
              , description: "A video test"
            }
            // I don't want to spam my subscribers
          , status: {
                privacyStatus: "public"
            }
        }
        // This is for the callback function
      , part: "snippet,status"

        // Create the readable stream to upload the video
      , media: {
            body: fs.createReadStream("/Users/jamesmaloney/Documents/Aus/IMG_0141.m4v")
        }
    }, (err, data) => {
        console.log("ERR", err)
        console.log("VIDEO", data)
        console.log("Done.");
        process.exit();
    });

    setInterval(function () {
        Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
    }, 250);
});
});

})

module.exports = router;
