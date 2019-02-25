import firebase from 'firebase/app'
import 'firebase/firestore'
import Vue from 'vue'

export const state = () => ({
  admin: false, // Sier om brukeren er admin eller ikke
  employee: false, // SIer om brukeren er ansatt eller ikke
  error: null, // Holder feilmeldingen vår
  loading: false, // Brukes ved logg inn i det vi begynner autentiseringen
  tables: [], // Holder alle bordene til restauranten
  user: null, // Holder brukeren
  reservations: [] // Holder alle reservasjonene
})

// Mutations are functions that the store uses to set its atrributes
export const mutations = {
  // Fjerner error melding
  clearError (state, payload) {
    state.error = null
  },
  // Setter storen til en ren state
  clearState (state) {
    state.admin = false
    state.employee = false
    state.error = null
    state.loading = false
    state.user = null
    state.tables = []
    state.reservations = []
  },
  // Fjerner bordet fra staten
  removeTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, null)
  },
  removeReservation (state, payload) {
    Vue.set(state.reservations, payload.reservationID - 1, null)
  },
  // Legger til bordet til staten
  setTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, payload)
  },
  // Setter loading som brukes ved innlogging
  setLoading (state, payload) {
    state.loading = payload
  },
  // Setter brukeren og om han er admin og/eller employee
  setUser (state, payload) {
    state.user = payload
    state.admin = payload.admin
    state.employee = payload.employee
  },
  // Setter feilmelding
  setError (state, payload) {
    state.error = payload
  },
  setReservation (state, payload) {
    Vue.set(state.reservations, payload.reservationID - 1, payload)
  }
}
// Actions are actions ran by the store. They are callable with this.$store.dispatch('actionnavn')
export const actions = {
  // Auto logger inn brukeren hvis hen har en aktiv token
  autoSignIn ({ commit, dispatch }, payload) {
    firebase.firestore().collection('users').doc(payload.uid).get()
      .then(user => {
        // Setter brukeren med data fra databasen, kaller på mountTables
        user = user.data()
        commit('setUser', user)
        dispatch('mountTables')
      })
      .catch(error => {
        console.log(error)
      })
  },
  // FJerner feilmeldingen
  clearError ({ commit }) {
    commit('clearError')
  },
  // Setter storen til en ren state. Brukes ved utlogging
  clearState ({ commit }) {
    commit('clearState')
  },
  // Laster inn alle reservasjoner fra databasen
  mountReservations ({ commit }) {
    firebase.firestore().collection('reservations').get()
      .then(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if (reservation.uid.length > 1) {
            firebase.firestore().collection('users')
              .doc(reservation.uid + '').get()
              .then(user => {
                reservation.user = user.data()
                commit('setReservation', reservation)
              })
          }
          else if (reservation.guestID.length > 1) {
            firebase.firestore().collection('guestUsers')
              .doc(reservation.guestID + '').get()
              .then(user => {
                reservation.user = user.data()
                commit('setReservation', reservation)
              })
          }
        })
      })
      .catch(error => {
        console.log('Klarte ikke å mounte reservasjoner')
        console.log(error)
      })
  },
  updateReservation ({ commit }, payload) {
    console.log(payload)
    firebase.firestore().collection('reservations').doc(payload.reservationID + '').set({
      reservationID: payload.reservationID,
      tableID: payload.tableID,
      numberOfPersons: payload.numberOfPersons,
      uid: payload.uid,
      guestID: payload.guestID,
      created: payload.created,
      duration: payload.duration,
      comments: payload.comments,
      startTime: payload.startTime,
      endTime: payload.endTime
    })
      .then(() => {
        commit('setReservation', payload)
        if (payload.uid > 0) {
          firebase.firestore().collection('users').doc(payload.uid + '').set({
            firstName: payload.firstName,
            lastName: payload.lastName,
            mobile: payload.mobile,
            email: payload.email,
            admin: payload.admin,
            employee: payload.employee,
            uid: payload.uid,
            username: payload.username
          }).catch(error => {
            console.log('Klarte ikke å oppdatere bruker med id ' + payload.uid)
            console.log(error)
          })
        }
        else if (payload.guestID > 0) {
          firebase.firestore().collection('guestUsers').doc(payload.guestID + '').set({
            firstName: payload.firstName,
            lastName: payload.lastName,
            mobile: payload.mobile,
            email: payload.email,
            guestID: payload.guestID
          }).catch(error => {
            console.log('Klarte ikke å oppdatere gjest med id ' + payload.guestID)
            console.log(error)
          })
        }
      })
      .catch(error => {
        console.log('Klarte ikke å oppdatere reservasjonen med id ' + payload.reservationID)
        console.log(error)
      })
  },
  // Removes the Reservation from the state and firestore
  removeReservation ({ commit }, payload) {
    commit('removeReservation', payload)
    console.log(payload)
    firebase.firestore().collection('reservations').doc(payload.reservationID + '').delete()
      .then(
        console.log('Fjernet reservasjon nr ' + payload.reservationID)
      )
      .catch(error => {
        console.log('Klarte ikke å slette bordet')
        console.log(error)
      })
  },
  // Laster inn alle bordene fra databasen
  mountTables ({ commit }) {
    firebase.firestore().collection('tables').get()
      .then(tables => {
        tables.forEach(table => {
          table = table.data()
          commit('setTable', table)
        })
      })
      .catch(error => {
        console.log('Klarte ikke å mounte bordene')
        console.log(error)
      })
  },
  // Oppdaterer og legger til bordet
  updateTable ({ commit }, payload) {
    firebase.firestore().collection('tables').doc(payload.tableID + '').set({
      tableID: payload.tableID,
      capacity: payload.capacity,
      currently: payload.currently,
      occupied: payload.occupied
    })
      .then(commit('setTable', payload))
      .catch(error => {
        console.log('Klarte ikke å oppdatere bord med id ' + payload.tableID)
        console.log(error)
      })
  },
  // Removes the table from the state and firestore
  removeTable ({ commit }, payload) {
    commit('removeTable', payload)
    firebase.firestore().collection('tables').doc(payload.tableID + '').delete()
      .then(
        console.log('Fjernet bord nr ' + payload.tableID)
      )
      .catch(error => {
        console.log('Klarte ikke å slette bordet')
        console.log(error)
      })
  },
  signUserUp ({ commit }, payload) {
  },
  // Signs in the user and gets his info from the database
  signUserIn ({ commit, dispatch }, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit('setLoading', false)
        firebase.firestore().collection('users').doc(user.user.uid).get()
          .then(user => {
            user = user.data()
            commit('setUser', user)
            dispatch('mountTables')
            dispatch('mountReservations')
          })
      })
      .catch(error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
  },
  signUserOut ({ commit }) {
    commit('setLoading', true)
    firebase.auth().signOut()
      .then(user => {
        commit('clearState')
        commit('setLoading', false)
      })
      // Sign-out successful.
      .catch(error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
  } }
// Getters are like the one used in Java to access the stores attributes.
export const getters = {
  admin (state) {
    return state.admin
  },
  employee (state) {
    return state.employee
  },
  error (state) {
    return state.error
  },
  loading (state) {
    return state.loading
  },
  user (state) {
    return state.user
  },
  tables (state) {
    return state.tables
  },
  reservations (state) {
    return state.reservations
  }
}
