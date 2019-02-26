import * as firebase from 'firebase/app'
import 'firebase/firestore'
// import moment from 'moment'

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
  // newReservationNumber returnerer det største reservasjonsnummeret i datbasen. Kan brukes ved opprettelse av nye reservasjonsobjekter.
  newReservationNumber () {
    return fs.collection('reservations')
      .orderBy('reservationID', 'desc')
      .limit(1)
      .get()
  }
}
