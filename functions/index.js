const  admin       = require('firebase-admin'),
      bodyParser  = require('body-parser'),
      cors        = require('cors'),
      express     = require('express'),
      functions   = require('firebase-functions'),
      moment      = require('moment'),
      request     = require('request'),
      // ses         = require('node-ses'),
      app         = express(),
      // Dato for åpningsdato
      openingDay = moment('2019-02-17', 'YYYY-MM-DD').valueOf(),
      // Dager siden åpningsdag
      days = moment().diff(openingDay, 'days'),
      // Uker siden åpningsdag
      weeks = moment().diff(openingDay, 'weeks'),
      nodemailer = require('nodemailer')


app.use(bodyParser.json())

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
/*
Setter opp en mailtransporter med autentifisering gjennom gmail-kontoen til selskapet.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tacosbetrippin@gmail.com',
    pass: 'trippin123'
  }
});

// 'use strict';

/*
Cloud-funksjon som henter informasjon om en nyopprettet reservasjon. Brukerens epost og navn, samt reservasjonsID og starttid
blir brukt til å generere en bekreftelsesepost til kunden.
 */
exports.sendWelcomeEmail = functions.https.onRequest((request, response) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  // ;
  let reservationID = request.body.reservationID; //henter brukerens reservasjonsID, epost, navn og tid for reservasjonen
  let email = request.body.email;
  let displayName = request.body.displayName;
  let startTime = request.body.startTime;
  console.log(email, displayName, reservationID, startTime);
  sendWelcomeEmail(email, displayName, reservationID, startTime)
    .then(response.send('Mail forsøkt sendt til ' + email))
    .catch(error => {
      console.log('Klarte ikke å sende epost')
      console.log(error)
      response.send(error)
    })
  }
);

exports.sendCancellationEmail = functions.https.onRequest((request, response) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    response.set('Access-Control-Allow-Origin', "*")
    response.set('Access-Control-Allow-Methods', 'GET, POST')
    let reservationID = request.body.reservationID;
    let email = request.body.email;
    let displayName = request.body.displayName;
    let startTime = request.body.startTime;
    console.log(email);
    return sendCancellationEmail(email, displayName, reservationID, startTime)
      .then(response.send('Mail forsøkt sendt til ' + email))
      .catch(error => {
        console.log('Klarte ikke å sende epost')
        console.log(error)
        response.send(error)
      })
  }
);

const APP_NAME = 'Trippin Tacos';

/*
Funksjon som genererer og sender bekreftelsesepost til kunde. Formatterer tiden for reservasjonen, reservasjonsIDen og en
link til siden for å endre reservasjonen.
 */
function sendWelcomeEmail(email, displayName, reservationID, startTime) {
  console.log(email)
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`, //Avsender
    to: email, //Mottaker
  };
  const startDate = moment(Number(startTime)).format('DD.MM.YYYY');
  startTime = moment(Number(startTime)).format('H:mm').add(1, 'hours');
  mailOptions.subject = `Din reservasjon hos ${APP_NAME} - ${startDate}`;//Emne
  mailOptions.text = `Hei, ${displayName || ''}! \n\nDette er en bekreftelse på din reservasjon hos ${APP_NAME}.\nDu har reservert bord hos oss ${startDate || ''} klokken ${startTime || ''}.\nDitt reservasjonsnummer: ${reservationID || ''}\nØnsker du å endre reservasjonen, kan du følge denne linken: https://pu30-5b0f9.firebaseapp.com/customerChangeReservation\n\nVi ses!`;//Innmat
  return transporter.sendMail(mailOptions) //Sender eposten
    .then(() => {
      return console.log('New welcome email sent to:', email);
    })
    .catch(error => {
      console.log(error)
    })
}

function sendCancellationEmail(email, displayName, reservationID, startTime) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };
  const startDate = moment(Number(startTime)).format('DD.MM.YYYY');
  startTime = moment(Number(startTime)).format('h:mm').add(1, 'hours');
  mailOptions.subject = `Avbestilling av reservasjon hos ${APP_NAME}`;
  mailOptions.text = `Hei, ${displayName || ''}! \n\nDette er en bekreftelse på din avbestilling hos ${APP_NAME}.\nAvbestillingen gjelder følgende reservasjon:\n\n${startDate || ''} klokken ${startTime || ''}.\nReservasjonsnummer: ${reservationID || ''}\n\nØnsker du å lage en ny reservasjonen, kan du følge denne linken: https://pu30-5b0f9.firebaseapp.com/customer-reservation\n\nHåper vi ser deg en annen gang!`;
  return transporter.sendMail(mailOptions)
    .then( () => {
      return console.log('Cancellation email sent to:', email);
    })
    .catch(error => {
      console.log(error)
    })
}

/*
Cloud funksjon som regner ut hvor mange reservasjoner vi har hver hele time på restauranten. Statistikken runder ned til hver påbegynte klokketime, så reservasjoner
som er fra f.eks 12:00 til 13:59 vil regnes som ekstra besøk kl 12 og 13, men ikke 14.
 */
exports.hourlyNumberOfReservations = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  let hourlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  console.log('/hourlyNumberOfReservations')
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
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
      let returnStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < hourlyStatistics.length; i++) {
        if (i > 11 && i < 24) {
          returnStatistics[i - 12] = hourlyStatistics[i] / days
        }
      }
      return response.status(200).send(returnStatistics)
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
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  let hourlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  console.log('/hourlyNumberOfPersons')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const startTime = Number(moment(reservation.startTime).format('H'))
        const endTime = Number(moment(reservation.endTime).format('H'))
        for (let i = Number(startTime); i < Number(endTime) + 1; i++) {
          hourlyStatistics[i - 1] = hourlyStatistics[i - 1] + Number(reservation.numberOfPersons)
        }
      })
    })
    .then(() => {
      let returnStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < hourlyStatistics.length; i++) {
        if (i > 11 && i < 25) {
          returnStatistics[i - 12] = hourlyStatistics[i] / days
        }
      }
      return response.status(200).send(returnStatistics)
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
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  let dailyStatistics = [0, 0, 0, 0, 0, 0, 0]
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  console.log('/dailyNumberOfReservations')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const weekday = Number(moment(reservation.startTime).day())
        dailyStatistics[weekday] = dailyStatistics[weekday] + 1
      })
    })
    .then(() => {
      for (let i = 0; i < dailyStatistics.length; i++) {
        dailyStatistics[i] = dailyStatistics[i] / weeks
      }
      console.log(dailyStatistics)
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
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  let dailyStatistics = [0, 0, 0, 0, 0, 0, 0]
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  console.log('/dailyNumberOfPersons')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const weekday = Number(moment(reservation.startTime).day())
        dailyStatistics[weekday] = dailyStatistics[weekday] + Number(reservation.numberOfPersons)
      })
    })
    .then(() => {
      for (let i = 0; i < dailyStatistics.length; i++) {
        dailyStatistics[i] = dailyStatistics[i] / weeks
      }
      console.log(dailyStatistics)
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
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  let monthlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  console.log('/monthlyNumberOfReservations')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const month = Number(moment(reservation.startTime).month())
        monthlyStatistics[month] = monthlyStatistics[month] + 1
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
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  let monthlyStatistics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
  console.log('/monthlyNumberOfPersons')
  db.collection('reservations')
    .get()
    .then(reservations => {
      return reservations.forEach(reservation => {
        reservation = reservation.data()
        const month = Number(moment(reservation.startTime).month())
        monthlyStatistics[month] = monthlyStatistics[month] + Number(reservation.numberOfPersons)
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
