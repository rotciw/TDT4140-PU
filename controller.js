import * as firebase from 'firebase/app'
import 'firebase/firestore'
import moment from 'moment'

let fs = firebase.firestore()

export const users = {
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

export const reservations = {
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
            /* let index = availableTables.indexOf(reservation.tableID)
            if (index > -1) availableTables.splice(index) */
          }
        })
      }).catch(error => {
        console.log('Klarte ikke å hente reservasjoner')
        console.log(error)
      })
    return availableTables
  },
  newReservationNumber () {
    return fs.collection('reservations')
      .orderBy('reservationID', 'desc')
      .limit(1)
      .get()
  }
}
