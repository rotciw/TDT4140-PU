const admin       = require('firebase-admin'),
      // auth        = require('basic-auth'),
      bodyParser  = require('body-parser'),
      cors        = require('cors')({ origin: true }),
      express     = require('express'),
      functions   = require('firebase-functions'),
      moment      = require('moment'),
      request     = require('request'),
      // ses         = require('node-ses'),
      app         = express()
      // Dato for åpningsdato
      openingDay = moment('2019-02-17', 'YYYY-MM-DD').valueOf()
      // Dager siden åpningsdag
      days = moment().diff(openingDay, 'days')
      // Uker siden åpningsdag
      weeks = moment().diff(openingDay, 'weeks')

app.use(bodyParser.json())
// admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  let message = request.body.message1
  response.send("Hello from Firebase! " + message)
})
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// The Firebase Admin SDK to access the Firebase Realtime Database.

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

/*
Cloud funksjon som regner ut hvor mange reservasjoner vi har hver hele time på restauranten. Statistikken runder ned til hver påbegynte klokketime, så reservasjoner
som er fra f.eks 12:00 til 13:59 vil regnes som ekstra besøk kl 12 og 13, men ikke 14.
 */
exports.hourlyNumberOfReservations = functions.https.onRequest((request, response) => {
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
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')
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
