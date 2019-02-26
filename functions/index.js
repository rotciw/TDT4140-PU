const admin       = require('firebase-admin'),
      auth        = require('basic-auth'),
      bodyParser  = require('body-parser'),
      cors        = require('cors')({ origin: true }),
      express     = require('express'),
      functions   = require('firebase-functions'),
      Moment      = require('moment'),
      request     = require('request'),
      ses         = require('node-ses'),
      app         = express()

app.use(bodyParser.json())

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// The Firebase Admin SDK to access the Firebase Realtime Database.

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();


