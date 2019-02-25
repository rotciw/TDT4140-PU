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
              availableTables[table.tableID - 1] = { available: true, id: table.tableID }
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
  }
}
