import * as firebase from 'firebase/app'
import 'firebase/firestore'
// import moment from 'moment'
// import moment from 'moment'
import axios from 'axios'

let fs = firebase.firestore()

/* Controlleren kan brukes for gjenbruk av databasekall/funksjoner. Spesielt god å bruke ved skrivinger hvor man ikke venter
* på respons. Ved lesing må man tenke på promises, da denne gjør async api kall til databasen. Controlleren brukes ved
* å skrive this.$controller. f.eks this.$controller.users.getUser(uid).
* */

// Users inneholder alle brukerrelaterte databasekall
export const users = {
  // getUser henter bruker med valgt uid fra databasen
  getUser (uid) {
    fs.collection('users').doc(uid + '').get()
      .then(user => {
        user = user.data()
        console.log(user)
        return user
      })
      .catch(error => {
        console.log('Klarte ikke å hente bruker med uid: ' + uid)
        console.log(error)
      })
  },
  // createGuestUser oppretter en gjestebruker. Brukes ved opprettelse av nye reservasjonsobjekter.
  createGuestUser (payload) {
    const userObject = {
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      email: payload.email || '',
      mobile: payload.mobile || ''
    }
    return fs.collection('guestUsers').add(userObject)
      .then(guestID => {
        userObject.guestID = guestID.id
        return fs.collection('guestUsers').doc(userObject.guestID + '').set(userObject)
          .then(() => {
            console.log(guestID)
            return guestID.id
          })
      })
      .catch(error => {
        console.log('Klarte ikke å lage gjestebruker')
        console.log(error)
      })
  },
  // Oppdaterer gjestebrukere
  updateGuestUser (payload) {
    const userObject = {
      firstName: payload.firstName || '',
      guestID: payload.guestID || '',
      lastName: payload.lastName || '',
      email: payload.email || '',
      mobile: payload.mobile || ''
    }
    fs.collection('guestUsers').doc(userObject.guestID + '').set(userObject)
      .catch(error => {
        console.log('Klarte ikke å oppdatere gjestebruker ' + payload.guestID)
        console.log(error)
      })
  },
  // Kan brukes til å rense i guestUsers databasen.
  removeOtherGuestUsers (payload) {
    if (payload.guestID) {
      if (payload.email) {
        fs.collection('guestUsers').where('email', '==', payload.email).delete()
      }
      else if (payload.mobile) {
        fs.collection('guestUsers').where('mobile', '==', payload.mobile).delete()
      }
      fs.collection('guestUsers')
        .doc(payload.guestID + '')
        .set(payload)
    }
  }
}
// Reservations inneholder alle reservasjonsrelaterte kall.
export const reservations = {
  /* Denne er ikke i bruk
  availableTables (startTime, endTime) {
    let now = moment().unix(),
        availableTables = []
    fs.collection('reservations')
      .where('startTime', '>', now)
      .get()
      .then(reservations => {
        fs.collection('tables')
          .get()
          .then(tables => {
            tables.forEach(table => {
              table = table.data()
              availableTables[table.tableID - 1] = { available: true, tableID: table.tableID }
            })
          }).catch(error => {
            console.log('Klarte ikke å hente bord')
            console.log(error)
          })
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if ((reservation.startTime > startTime && reservation.startTime < endTime) || (reservation.endTime > startTime && reservation.endTime < endTime)) {
            availableTables[reservation.tableID - 1].available = false
            /!* let index = availableTables.indexOf(reservation.tableID)
            if (index > -1) availableTables.splice(index) *!/
          }
        })
      }).catch(error => {
        console.log('Klarte ikke å hente reservasjoner')
        console.log(error)
      })
    return availableTables
  }, */
  /*
  Tenkte først å lage en controller som sjekket ledige bord for kunder, men dette ble for komplisert. Gikk derfor over til å kun burke storen
   */
  /* checkCustomerRequest (startTime, endTime, numberOfPersons) {
    /!* const availableSlots =
      ['12:00', '12:15', '12:30', '12:45',
      '13:00', '13:15', '13:30', '13:45',
      '14:00', '14:15', '14:30', '14:45',
      '15:00', '15:15', '15:30', '15:45',
      '16:00', '16:15', '16:30', '16:45',
      '17:00', '17:15', '17:30', '17:45',
      '18:00', '18:15', '18:30', '18:45',
      '19:00', '19:15', '19:30', '19:45',
      '20:00', '20:15', '20:30', '20:45',
      '21:00', '21:15', '21:30', '21:45',
      '22:00'] *!/
    let oneDayAhed = moment().add(1, 'day').valueOf()
    const tomorrowFormated = moment().add(1, 'day').format('YYYY/MM/DD')
    fs.collection('tables')
      .where('capacaity', '>=', numberOfPersons)
      .get()
      .then(tables => {
        tables.forEach(table => {
          table = table.data()
          fs.collection('reservations')
            .where('tableID', '==', table.tableID)
            .where('endTime', '>', oneDayAhed)
            .get()
            .then(reservations => {
              reservations.forEach(reservation => {
                reservation = reservation.data()
                if (reservation.startTime )
              })
            })
        })
      }
  })
  , */
  // newReservationNumber returnerer det største reservasjonsnummeret i datbasen. Kan brukes ved opprettelse av nye reservasjonsobjekter.
  createReservation (reservationObject) {
    console.log(reservationObject)
    fs.collection('reservations').doc(reservationObject.reservationID + '').set(reservationObject)
      .then(() => {
        axios.post('https://us-central1-pu30-5b0f9.cloudfunctions.net/sendWelcomeEmail', reservationObject)
      })
      .catch(error => {
        console.log(error)
        console.log('Klarte ikke å opprette reservasjon')
      })
  },
  newReservationNumber () {
    return fs.collection('reservations')
      .orderBy('reservationID', 'desc')
      .limit(1)
      .get()
  }
}
