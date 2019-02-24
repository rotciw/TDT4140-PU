import firebase from 'firebase/app'
import 'firebase/firestore'
import Vue from 'vue'
import moment from 'moment'
// import { cloneDeep } from 'lodash'

export const strict = false

export const state = () => ({
  admin: false, // Sier om brukeren er admin eller ikke
  employee: false, // SIer om brukeren er ansatt eller ikke
  error: null, // Holder feilmeldingen vår
  loading: false, // Brukes ved logg inn i det vi begynner autentiseringen
  tables: [], // Holder alle bordene til restauranten
  todaysTables: [], // Holder alle bordene samt alle reservasjonene disse bordene har i dag
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
    state.reservations = []
    state.tables = []
    state.todaysTables = []
    state.user = null
  },
  // Fjerner bordet fra staten
  removeTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, null)
  },
  // Legger til bordet til staten
  setTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, payload)
  },
  // Legger til bord med dagens reservasjoner
  setTodaysTable (state, payload) {
    Vue.set(state.todaysTables, payload.tableID - 1, payload)
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
  autoSignIn ({ commit }, payload) {
    firebase.firestore().collection('users').doc(payload.uid).get()
      .then(user => {
        // Setter brukeren med data fra databasen, kaller på mountTables
        user = user.data()
        commit('setUser', user)
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
    firebase.firestore().collection('reservations')
      .onSnapshot(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if (reservation.userID.length > 0) {
            firebase.firestore().collection('users')
              .doc(reservation.userID + '').get()
              .then(user => {
                reservation.user = user.data()
                commit('setReservation', reservation)
              })
          }
          else if (reservation.guestID.length > 0) {
            firebase.firestore().collection('guestUsers')
              .doc(reservation.guestID + '').get()
              .then(user => {
                reservation.user = user.data()
                commit('setReservation', reservation)
              })
          }
        })
      },
      error => {
        console.log('Klarte ikke å mounte reservasjoner')
        console.log(error)
      })
      /* .catch(error => {
      }) */
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
  mountTodaysTablesWithReservations ({ commit }) {
    // Finner alle reservasjonene som er i dag
    let tomorrow = moment().endOf('day').unix()
    // let yesterday = moment().startOf('day').unix
    // Henter bordene fra databasen.
    firebase.firestore().collection('tables').get()
      .then(tables => {
        tables.forEach(table => {
          table = table.data()
          /*  Hvis bordet har reservasjoner på seg blir denne kjørt. Pga begrensninger i Firestore
          er det ikke mulig å sortere ut spørringene på både bordID og samtidig kun reservasjoner som er i framtiden.
          (Bruk av == og > på forskjellige felter er ikke mulig. En annen løsning her vil være og hente alle reservasjonene
          i framtiden, og så matche reservasjonene på bordID. Dette kan vi vurdere hvis vi ser at det blir mange unødvendige spørringer).
          Denne lytter til endringer med onSnapshot.
           */
          firebase.firestore().collection('reservations')
            .where('tableID', '==', table.tableID)
            .orderBy('startTime')
            .onSnapshot(reservations => {
              reservations.forEach(reservation => {
                let now = moment().unix()
                reservation = reservation.data()
                table.reservations = []
                if (reservation.endTime < tomorrow && reservation.startTime > now) table.reservations.push(reservation)
                if (reservation.endTime >= now && reservation.startTime <= now) {
                  table.occupied = true
                  table.currently = reservation.numberOfPersons
                  table.currentReservation = reservation
                }
                else {
                  table.occupied = false
                  table.currently = 0
                }
                console.log(table)
                commit('setTable', table)
              })
            },
            error => {
              console.log('Klarte ikke å hente reservasjonene til bord nummer ' + table.tableID)
              console.log(error)
            })
          commit('setTable', table)
        })
      })
      .catch(error => {
        console.log('Klarte ikke å hente bord')
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
  signUserIn ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit('setLoading', false)
        firebase.firestore().collection('users').doc(user.user.uid).get()
          .then(user => {
            user = user.data()
            commit('setUser', user)
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
  todaysTables (state) {
    return state.todaysTables
  },
  reservations (state) {
    return state.reservations
  }
}
