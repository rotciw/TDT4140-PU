import * as firebase from 'firebase/app'
import 'firebase/firestore'
// import moment from 'moment'
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
  updateUser (payload) {
    const userObject = {
      firstName: payload.firstName || '',
      guestID: payload.guestID || '',
      lastName: payload.lastName || '',
      email: payload.email || '',
      mobile: payload.mobile || ''
    }
    fs.collection('user').doc(userObject.uid + '').set(userObject)
      .catch(error => {
        console.log('Klarte ikke å oppdatere bruker ' + payload.uid)
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
  // Oppretter ny reservasjon
  createReservation (reservationObject) {
    console.log(reservationObject)
    return fs.collection('reservations').doc(reservationObject.reservationID + '').set(reservationObject)
      .then(() => {
        return true
      })
      .catch(error => {
        console.log(error)
        console.log('Klarte ikke å opprette reservasjon')
        return false
      })
  },
  // Sletter gamle reservasjoner
  deleteReservation (reservationObject) {
    fs.collection('reservations').doc(reservationObject.reservationID + '').delete()
      .catch(error => {
        console.log(error)
        console.log('Klarte ikke å slette reservasjonsnummer: ' + reservationObject.reservationID)
      })
  },
  // newReservationNumber returnerer det største reservasjonsnummeret i datbasen. Kan brukes ved opprettelse av nye reservasjonsobjekter.
  newReservationNumber () {
    return fs.collection('reservations')
      .orderBy('reservationID', 'desc')
      .limit(1)
      .get()
  },
  // Oppdaterer valgt reservasjon
  updateReservation (reservation) {
    const updateObject = {
      reservationID: reservation.reservationID || '',
      tableID: reservation.tableID || '',
      uid: reservation.uid || '',
      guestID: reservation.guestID || '',
      numberOfPersons: reservation.numberOfPersons || '',
      created: reservation.created || '',
      duration: reservation.duration || '',
      comments: reservation.comments || '',
      startTime: reservation.startTime || '',
      endTime: reservation.endTime || ''
    }
    fs.collection('reservations').doc(updateObject.reservationID + '').set(updateObject)
      .then(() => {
        return true
      })
      .catch(error => {
        console.log('Klarte ikke å oppdatere reservasjonsnummer ' + updateObject.reservationID)
        console.log(error)
        return false
      })
  }
}
