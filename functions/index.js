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
app.use(cors( {origin: true } ))

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  let message = request.body.message
  response.send("Hello from Firebase! " + message)
})
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// The Firebase Admin SDK to access the Firebase Realtime Database.

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tacosbetrippin@gmail.com',
    pass: 'trippin123'
  }
});

// 'use strict';

exports.sendWelcomeEmail = functions.https.onRequest((request, response) => {
  let reservationID = request.body.reservationID
  let email = request.body.email
  let displayName = request.body.displayName
  let startTime = request.body.startTime
  console.log(email)
  return sendWelcomeEmail(email, displayName, reservationID, startTime)
    .then(response.send('Mail sendt til ' + email))
  }
)

const APP_NAME = 'Trippin Tacos'


// Sends a welcome email to the given user.
// TODO: Legge til dato og tidspunkt ved å bruke moment sin funksjon på starttime. Tips: moment(startTime).format('H:mm DD/MM/YYYY') f.eks.
// TODO: Legge til link til reservasjonssiden hvor man kan endre reservasjonen
function sendWelcomeEmail(email, displayName, reservationID, startTime) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Din reservasjon hos ${APP_NAME}!`;
  mailOptions.text = `Hei ${displayName || ''}! \n\nDette er en bekreftelse på din reservasjon hos ${APP_NAME}. \nDin reservasjonsID: ${reservationID || ''} \nStarttid: ${startTime || ''}\n\nVel møtt!`;
  return transporter.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to:', email);
  });
}
/*
Cloud funksjon som regner ut hvor mange reservasjoner vi har hver hele time på restauranten. Statistikken runder ned til hver påbegynte klokketime, så reservasjoner
som er fra f.eks 12:00 til 13:59 vil regnes som ekstra besøk kl 12 og 13, men ikke 14.
 */
exports.hourlyNumberOfReservations = functions.https.onRequest((request, response) => {
  let hourlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  console.log('/hourlyNumberOfReservations')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const startTime = moment(reservation.startTime).format('H')
        const endTime = moment(reservation.endTime).format('H')
        for (let i = Number(startTime); i < Number(endTime) + 1; i++) {
          hourlyStatistics[i - 1] = hourlyStatistics[i - 1] + 1
        }
      })
    })
    .then(() => {
      return response.status(200).send(hourlyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å mounte timestatistikk for antall reservasjoner')
      console.log(error)
      response.send(error)
    })
})

/*
Cloud funksjon som regner ut hvor mange besøkende vi har hver hele time på restauranten. Statistikken runder ned til hver påbegynte klokketime, så reservasjoner
som er fra f.eks 12:00 til 13:59 vil regnes som ekstra besøk kl 12 og 13, men ikke 14.
 */
exports.hourlyNumberOfPersons = functions.https.onRequest((request, response) => {
  let hourlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  console.log('/hourlyNumberOfPersons')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const startTime = moment(reservation.startTime).format('H')
        const endTime = moment(reservation.endTime).format('H')
        for (let i = Number(startTime); i < Number(endTime) + 1; i++) {
          hourlyStatistics[i - 1] = hourlyStatistics[i - 1] + reservation.numberOfPersons
        }
      })
    })
    .then(() => {
      return response.status(200).send(hourlyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å mounte timestatistikk for antall besøkende')
      console.log(error)
      response.send(error)
    })
})
/*
Cloud funksjon som regner ut hvor mange reservasjoner vi har hver ukedag
 */
exports.dailyNumberOfReservations = functions.https.onRequest((request, response) => {
  let dailyStatistics = [0, 0, 0, 0, 0, 0, 0]
  console.log('/dailyNumberOfReservations')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const weekday = Number(moment(reservation.startTime).day())
        dailyStatistics[weekday - 1] = dailyStatistics[weekday - 1] + 1
      })
    })
    .then(() => {
      return response.status(200).send(dailyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å mounte timestatistikk for antall besøkende')
      console.log(error)
      response.send(error)
    })
})

/*
Cloud funksjon som regner ut hvor mange besøkende vi har hver ukedag
 */
exports.dailyNumberOfPersons = functions.https.onRequest((request, response) => {
  let dailyStatistics = [0, 0, 0, 0, 0, 0, 0]
  console.log('/dailyNumberOfPersons')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const weekday = Number(moment(reservation.startTime).day())
        dailyStatistics[weekday - 1] = dailyStatistics[weekday - 1] + Number(reservation.numberOfPersons)
      })
    })
    .then(() => {
      return response.status(200).send(dailyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å mounte timestatistikk for antall besøkende')
      console.log(error)
      response.send(error)
    })
})


/*
Cloud funksjon som regner ut hvor mange reservasjoner vi har hver måned
 */

exports.monthlyNumberOfReservations = functions.https.onRequest((request, response) => {
  let monthlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  console.log('/monthlyNumberOfReservations')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const month = Number(moment(reservation.startTime).month())
        monthlyStatistics[month - 1] = monthlyStatistics[month - 1] + 1
      })
    })
    .then(() => {
      return response.status(200).send(monthlyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å mounte timestatistikk for antall besøkende')
      console.log(error)
      response.send(error)
    })
})

/*
Cloud funksjon som regner ut hvor mange besøkende vi har hver måned
 */

exports.monthlyNumberOfPersons = functions.https.onRequest((request, response) => {
  let monthlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  console.log('/monthlyNumberOfPersons')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const month = Number(moment(reservation.startTime).month())
        monthlyStatistics[month - 1] = monthlyStatistics[month - 1] + Number(reservation.numberOfPersons)
      })
    })
    .then(() => {
      return response.status(200).send(monthlyStatistics)
    })
    .catch(error => {
      console.log('Klarte ikke å mounte timestatistikk for antall besøkende')
      console.log(error)
      response.send(error)
    })
})




/*
Funksjon som oppdaterer alle feltene i reservasjonsbasen til true. Ble utført 11.03 før kundesystemet ble satt i prod,
ettersom alle reservasjoner fram til dette var gjort via systemet i restauranten.
 */
/*exports.databaseChangeDropin = functions.https.onRequest((request, response) => {
  console.log('/databaseChangeDropin')
  counter = 0
  db.collection('reservations').get()
    .then(reservations => {
      reservations.forEach(reservation => {
        reservation = reservation.data()
        reservation.dropIn = true
        db.collection('reservations').doc(reservation.reservationID + '').set(reservation)
          .then(() => {
            counter++
          })
          .catch(error => {
            console.log('Klarte ikke å oppdatere reservasjon med ID ' + reservation.reservationID)
            console.log(error)
          })
      })
    })
    .catch(error => {
      console.log('Klarte ikke å hente reservasjoner')
      console.log(error)
    })
  response.send('Oppdaterte ' + counter)
})*/
