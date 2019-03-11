const  admin       = require('firebase-admin'),
      bodyParser  = require('body-parser'),
      cors        = require('cors'),
      express     = require('express'),
      functions   = require('firebase-functions'),
      moment      = require('moment'),
      request     = require('request'),
      app         = express(),
      nodemailer = require('nodemailer');


app.use(bodyParser.json())
app.use(cors({origin: true }))

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// The Firebase Admin SDK to access the Firebase Realtime Database.

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@address.com',
    pass: 'yourpassword'
  }
});

'use strict';

exports.sendWelcomeEmail = functions.firestore.document('reservations').onCreate((snap, context) => {
  const newReservation = snap.data()
    .then( newReservation => {
      if (snap.uid !== 'dJSnjP4jPbXGZZ6E2oMq9ghkC3m2' && snap.uid !== 'vwTDv1gkOsci0mUHvc81NKKFKs73'){
        console.log('sendt Welcome Email')
        return sendWelcomeEmail(newReservation.email, newReservation.displayName)}

    })
    .then(() => {
      return response.status(200).send(hourlyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å sende epost')
      console.log(error)
      response.send(error)
    })
})




app.post('/sendReservationEmail', (request, response) => {
  console.log('sendt reservation confirmation email')

  const { startTime, numberOfPersons, reservationID, email } = request.body
  const gmailEmail = functions.config().gmail.email;
  const gmailPassword = functions.config().gmail.password;
  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tacosbetrippin',
      pass: 'trippin123',
    },
  })
  response.status(200).send(startTime)
})

// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.


// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Trippin Tacos'
// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
// [END onCreateTrigger]
  // [START eventAttributes]
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  // [END eventAttributes]

  return sendWelcomeEmail(email, displayName);
});

// Sends a welcome email to the given user.
function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Din reservasjon hos ${APP_NAME}!`;
  mailOptions.text = `Hei ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  return transporter.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to:', email);
  });
}


