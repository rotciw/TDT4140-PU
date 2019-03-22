import firebase from 'firebase/app'
import 'firebase/firestore'
import Vue from 'vue'
import moment from 'moment'
// import axios from 'axios'
// import { cloneDeep } from 'lodash'

export const strict = false

export const state = () => ({
  admin: false, // Sier om brukeren er admin eller ikke
  availableTables: [], // Holder alle bordene som er ledige og etterspurt for antall gjester og tidspunkt
  customerRequestedTables: [], // Inneholder ledige bord etterspurt av kunde
  employee: false, // SIer om brukeren er ansatt eller ikke
  error: null, // Holder feilmeldingen vår
  loading: false, // Brukes ved logg inn i det vi begynner autentiseringen
  reservation: null,
  reservations: [], // Holder alle reservasjonene
  tables: [], // Holder alle bordene til restauranten
  tableAvailable: [], // Holder ledigheten for etterspurt bord
  todaysTables: [], // Holder alle bordene samt alle reservasjonene disse bordene har i dag
  user: null // Holder brukeren
})

// Mutations are functions that the store uses to set its atrributes
export const mutations = {
  clearAvailableTables (state) {
    state.availableTables = []
  },
  clearAvailability (state) {
    state.tableAvailable = []
  },
  // Fjerner bordene som ligger fra forrige etterspørsel.
  clearCustomerRequestedTable (state) {
    state.customerRequestedTable = []
  },
  // Fjerner bordene som ligger fra forrige etterspørsel.
  clearCustomerRequestedTables (state) {
    state.customerRequestedTables = []
  },
  // Fjerner error melding
  clearError (state) {
    state.error = null
  },
  // Setter storen til en ren state
  clearState (state) {
    state.admin = false
    state.availableTables = []
    state.employee = false
    state.error = null
    state.loading = false
    state.reservation = null
    state.reservations = []
    state.tableAvailable = []
    state.tables = []
    state.todaysTables = []
    state.user = null
  },
  // Fjerner bordet fra staten
  removeTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, null)
  },
  // Fjerner valgt reservasjon fra staten
  removeReservation (state, payload) {
    Vue.set(state.reservations, payload.reservationID - 1, null)
  },
  // Endrer tilgjengeligheten til et bord
  setCustomerRequestedTable (state, payload) {
    Vue.set(state.customerRequestedTables, payload.tableID - 1, payload)
  },
  // Legger inn alle bord som har kapasitet nok til reservasjonen
  setCustomerRequestedTables (state, payload) {
    state.tables.forEach(table => {
      if (Number(payload) > Number(table.capacity)) Vue.set(state.customerRequestedTables, table.tableID - 1, { available: false, tableID: table.tableID, capacity: table.capacity })
      else Vue.set(state.customerRequestedTables, table.tableID - 1, { available: true, tableID: table.tableID, capacity: table.capacity })
    })
  },
  setFetchedReservation (state, payload) {
    state.reservation = payload
  },
  // Legger til bordet til staten
  setTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, payload)
  },
  // Legger til bord med dagens reservasjoner
  setTodaysTable (state, payload) {
    Vue.set(state.todaysTables, payload.tableID - 1, payload)
  },
  // Endrer ledigheten til et bord av actionen MountAvailableTables, hvis bordet har overlappende reservasjon
  setAvailableTable (state, payload) {
    Vue.set(state.availableTables, payload.tableID - 1, payload)
  },
  // Legger til alle bord som er tilgjengelig for valgt kapasitet i staten, brukes av NewReservation
  setAvailableTables (state, payload) {
    state.tables.forEach(table => {
      if (Number(payload) > Number(table.capacity)) Vue.set(state.availableTables, table.tableID - 1, { available: false, tableID: table.tableID, capacity: table.capacity })
      else Vue.set(state.availableTables, table.tableID - 1, { available: true, tableID: table.tableID, capacity: table.capacity })
    })
  },
  // Setter ledigheten til forespurt bord ved gitte tidspunkt til enten ledig eller ei. Brukes av ViewTable når man etterspør spesifikt bord.
  setTableAvailability (state, payload) {
    Vue.set(state.tableAvailable, state.tableAvailable.length, payload)
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
  // Legger til reservasjon når action MountReservations kjører
  setReservation (state, payload) {
    Vue.set(state.reservations, payload.reservationID - 1, payload)
  }
}
// Actions er async funksjoner. Kallbare med this.$store.dispatch('actionnavn')
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
  /* Brukes av ViewTable for å sjekke om bordet er ledig for valgte tidspunkt. Denne henter alle reservasjoner som er
  * fram i tid for valgt bord. Hvis reservasjonstidene overlapper vet vi at bordet er opptatt på valgte tidspunkt
  * og vi kaller så på mutasjonen setTableAvailability med false, fordi bordet ikke er ledig. Hvis det er ledig kalles
  * den samme mutasjonen, men med ledig. Ved å bruke onSnapshot vil denne kjøre hver gang det skjer en endring i reservations
  * collectionen. Dette brukes så av ViewTable for å si at bordet ikke er ledig for valgte tidspunkt.
  * */
  checkAvailability ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearAvailability')
    let now = moment().valueOf(),
        available = true
    firebase.firestore().collection('reservations')
      .where('tableID', '==', payload.tableID)
      .where('endTime', '>', now)
      .onSnapshot(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if ((reservation.startTime > payload.startTime && reservation.startTime < payload.endTime) ||
            (reservation.endTime > payload.startTime && reservation.endTime < payload.endTime) ||
            (reservation.startTime <= payload.startTime && reservation.endTime >= payload.endTime)) {
            commit('setTableAvailability', false)
            available = false
          }
          else {
            available = true
            commit('setTableAvailability', available)
          }
        })
      })
    commit('setLoading', false)
  },
  /* Brukes av allReservations for å sjekke om bordet er ledig for valgte tidspunkt. Denne henter alle reservasjoner som er
  * fram i tid for valgt bord. Hvis reservasjonstidene overlapper vet vi at bordet er opptatt på valgte tidspunkt
  * og vi pusher så på mutasjonen setTableAvailability med false, fordi bordet ikke er ledig. Hvis det er ledig kalles
  * den samme mutasjonen, men med ledig. Ved å bruke onSnapshot vil denne kjøre hver gang det skjer en endring i reservations
  * collectionen. Dette brukes så av allReservations når man endrer en reservasjon for å si at bordet ikke er ledig for valgte tidspunkt.
  * Fordi checkAvailability ikke tar hensyn til hvilket reservajonsnummer man prøver å endre, vil den si at bordet er opptatt hvis man prøver å endre
  * en egen reservasjon. I checkAvailabilityWithReservation sjekker vi kun overlapp på reservasjonene som ikke har lik reservasjonsID.
  * */
  checkAvailabilityWithReservation ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearAvailability')
    let now = moment().valueOf()
    firebase.firestore().collection('reservations')
      .where('tableID', '==', payload.tableID)
      .where('endTime', '>', now)
      .onSnapshot(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if (Number(reservation.reservationID) !== Number(payload.reservationID)) {
            if ((reservation.startTime > payload.startTime && reservation.startTime < payload.endTime) ||
              (reservation.endTime > payload.startTime && reservation.endTime < payload.endTime) ||
              (reservation.startTime <= payload.startTime && reservation.endTime >= payload.endTime)) {
              commit('setTableAvailability', false)
            }
          }
        })
      })
    commit('setLoading', false)
  },
  /*
  Brukes av customer-reservation til å finne ut om det er ledige bord for etterspurte tidspunkt og mengde.
  Sjekker hvilke bord som har stor nok kapasitet, og hvilke bord som ikke har overlappende reservasjonsstider
   */
  checkCustomerRequestedTable ({ commit, state }, payload) {
    commit('setLoading', true)
    commit('clearCustomerRequestedTables')
    commit('setCustomerRequestedTables', payload.numberOfPersons)
    let now = moment().valueOf()
    firebase.firestore().collection('reservations')
      .where('endTime', '>', now)
      .get()
      .then(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if ((reservation.startTime > payload.startTime && reservation.startTime < payload.endTime) ||
            (reservation.endTime > payload.startTime && reservation.endTime < payload.endTime) ||
            (reservation.startTime <= payload.startTime && reservation.endTime >= payload.endTime)) {
            commit('setCustomerRequestedTable', { tableID: reservation.tableID, available: false })
          }
        })
      })
    commit('setLoading', false)
  },
  // FJerner feilmeldingen
  clearError ({ commit }) {
    commit('clearError')
  },
  // Setter storen til en ren state. Brukes ved utlogging
  clearState ({ commit }) {
    commit('clearState')
  },
  /* createReservation oppretter en ny reservasjon i databasen, og legger dem i storen hvis det var en vellykket skriving.
   Denne brukes av komponenten NewReservation og ViewTable fra bookingsiden
  * når nye reservasjoner blir opprettet.
  * */
  createReservation ({ commit, state }, payload) {
    firebase.firestore().collection('reservations').doc(payload.reservationID + '')
      .set(payload)
      .then(res => {
        console.log(res)
        commit('setReservation', payload)
      })
      .catch(error => {
        console.log('Klarte ikke å lage ny reservasjon')
        console.log(error)
      })
  },
  fetchReservation ({ commit }, payload) {
    commit('setLoading', true)
    firebase.firestore().collection('reservations').doc(payload.reservationID + '')
      .get()
      .then(reservation => {
        reservation = reservation.data()
        if (reservation.uid.length > 0) {
          firebase.firestore().collection('users')
            .doc(reservation.uid + '')
            .get()
            .then(user => {
              user = user.data()
              if (user.email === payload.email) {
                reservation.user = user
                commit('setFetchedReservation', reservation)
                commit('setLoading', false)
              }
              else {
                commit('setError', 'Fant ikke reservasjonen. Prøv igjen.')
                commit('setLoading', false)
              }
            })
        }
        else if (reservation.guestID.length > 0) {
          firebase.firestore().collection('guestUsers').doc(reservation.guestID + '')
            .get()
            .then(user => {
              user = user.data()
              if (user.email === payload.email) {
                reservation.user = user
                commit('setFetchedReservation', reservation)
                commit('setLoading', false)
              }
              else {
                commit('setError', 'Fant ikke reservasjonen. Prøv igjen.')
                commit('setLoading', false)
              }
            })
        }
      })
      .catch(error => {
        console.log('Klarte ikke å hente reservasjon med ID: ' + payload.reservationID)
        commit('setError', 'Fant ikke reservasjonen. Prøv igjen.')
        console.log(error)
        commit('setLoading', false)
      })
  },
  /* mountAvailableTables brukes av newReservation for å finne ledige bord til valgt tidspunkt og til riktig antall personer.
  *  Dette skjer i følgende steg:
  *  1. Slett alle bordene som er tilgjengelig fra forrige søk
  *  2. Hent alle bordene som ligger i tables som har plass til personer definert på reservasjonen
  *  3. Hent alle reservasjoner som er fram i tid. Gå så igjennom alle reservasjonene.
  *     Hvis det er overlapp er dette bordet opptatt for valgt tidspunkt, og vi endrer så statusen på dette bordet til opptatt.
  *  4. Dette brukes så i NewReservation komponenten, og viser alle ledige bord.
  * */
  mountAvailableTables ({ commit, state }, payload) {
    commit('clearAvailableTables')
    commit('setAvailableTables', payload.numberOfPersons)
    let now = moment().valueOf()
    firebase.firestore().collection('reservations')
      .where('endTime', '>', now)
      .onSnapshot(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if ((reservation.startTime > payload.startTime && reservation.startTime < payload.endTime) ||
              (reservation.endTime > payload.startTime && reservation.endTime < payload.endTime) ||
              (reservation.startTime <= payload.startTime && reservation.endTime >= payload.endTime)) {
            commit('setAvailableTable', { tableID: reservation.tableID, available: false, currently: reservation.numberOfPersons })
          }
        })
      },
      error => {
        console.log('Klarte ikke å hente reservasjoner')
        console.log(error)
      })
    commit('setLoading', false)
  },
  /* mountReservations henter først alle reservasjonene fra databasen. Derette sjekker den om det er en bruker eller en
  *  gjestebruker som er koblet til reservasjonen. Ut i fra om det er bruker eller gjest henter den bruker fra enten
  *  users eller guestUsers, og kobler dette objektet på reservasjonsobjektet under reservation.user. Dette brukes av siden
  *  allreservations til å vise info om alle reservasjoner og informasjonen om brukeren tilknyttet reservasjonen
  * */
  mountReservations ({ commit }) {
    const today = moment().startOf('day').valueOf()
    firebase.firestore().collection('reservations')
      .where('startTime', '>', today)
      .onSnapshot(reservations => {
        reservations.forEach(reservation => {
          reservation = reservation.data()
          if (reservation.uid && reservation.uid.length > 1) {
            firebase.firestore().collection('users')
              .doc(reservation.uid + '').get()
              .then(user => {
                reservation.user = user.data()
                commit('setReservation', reservation)
              })
          }
          else if (reservation.guestID && reservation.guestID.length > 1) {
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
  /* updateReservation oppdaterer reservasjon valgt fra allreservations. Dette gjøres ved å sette et objekt som er likt som
  *  det gamle, med de samme feltene. Deretter oppdateres brukeren utifra om det er gjest eller bruker som er tilknyttet
  *  reservasjonen i riktig collection.
  * */
  updateReservation ({ commit }, payload) {
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
        if (payload.user) {
          if (payload.uid.length > 0) {
            firebase.firestore().collection('users').doc(payload.uid + '').set({
              firstName: payload.user.firstName,
              lastName: payload.user.lastName,
              mobile: payload.user.mobile,
              email: payload.user.email,
              admin: payload.user.admin,
              employee: payload.user.employee,
              uid: payload.user.uid
            }).catch(error => {
              console.log('Klarte ikke å oppdatere bruker med id ' + payload.uid)
              console.log(error)
            })
          }
          else if (payload.guestID > 0) {
            firebase.firestore().collection('guestUsers').doc(payload.guestID + '').set({
              firstName: payload.user.firstName,
              lastName: payload.user.lastName,
              mobile: payload.user.mobile,
              email: payload.user.email,
              guestID: payload.user.guestID
            }).catch(error => {
              console.log('Klarte ikke å oppdatere gjest med id ' + payload.guestID)
              console.log(error)
            })
          }
        }
        else {
          if (payload.uid > 0) {
            firebase.firestore().collection('users').doc(payload.uid + '').set({
              firstName: payload.firstName,
              lastName: payload.lastName,
              mobile: payload.mobile,
              email: payload.email,
              admin: payload.admin,
              employee: payload.employee,
              uid: payload.uid
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
        }
      })
      .catch(error => {
        console.log('Klarte ikke å oppdatere reservasjonen med id ' + payload.reservationID)
        console.log(error)
      })
  },
  // removeReservation sletter reservasjonen. Gjøres fra allreservations.
  removeReservation ({ commit }, payload) {
    commit('removeReservation', payload)
    firebase.firestore().collection('reservations').doc(payload.reservationID + '').delete()
      .then(
        console.log('Fjernet reservasjon nr ' + payload.reservationID)
      )
      .catch(error => {
        console.log('Klarte ikke å slette bordet')
        console.log(error)
      })
  },
  // mountTables laster inn alle bordene som er lagret i databasen.
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
  /* mountTodaysTablesWithReservations brukes av bookingsiden til å vise status på alle bordene som er i restauranten.
  *  Henter alle bordene, og deretter reservasjon for hvert bord hvis bordet har reservasjon. Pga begrensinger i firestore
  *  kan vi kun bruke en rekkevide sorterer i databasekallet vårt, og vi blir nødt til å hente alle reservasjonene våre selvom de evt.
  *  overlapper. Denne lytter til endringer med onSnapshot. Deretter skjer følgende:
  *  1 Etter at den har hentet alle reservasjonene til bord med reservasjoner
  *  opprettes et reservasjonsarray på bordet. Dette inneholder alle reservasjoner som er registrert på bordet i dag i stigende rekkefølge
  *  2 Hvis en av reservasjonene har starttid før tidspunktet de blir hentet og slutttid etter, vet vi at det er en pågående reservasjon.
  *  Da settes det en attributt currentReservation. Denne brukes deretter i booking for å vise info om pågående reservasjon.
  *  3 Hvis det ikke er noe pågående reservasjon settes bordet som ledig. Bordet blir deretter satt inn i state.tables.
  * */
  mountTodaysTablesWithReservations ({ commit }) {
    // Finner alle reservasjonene som er i dag
    let tomorrow = moment().endOf('day').valueOf(),
        today = moment().startOf('day').valueOf()
    // let yesterday = moment().startOf('day').unix
    // Henter bordene fra databasen.
    firebase.firestore().collection('tables').get()
      .then(tables => {
        tables.forEach(table => {
          table = table.data()
          firebase.firestore().collection('reservations')
            .where('tableID', '==', table.tableID)
            .where('startTime', '>', today)
            .orderBy('startTime')
            .onSnapshot(reservations => {
              table.reservations = []
              reservations.forEach(reservation => {
                let now = moment().valueOf()
                reservation = reservation.data()
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
  /* updateLiveReservation brukes av ViewTable for å oppdatere slutttidspunktet eller antall gjester på en pågående reservasjon.
  *   Oppdaterer først databasen. Hvis det var vellykket endrer vi reservasjonen lokalt i storen ved å commite setReservation med
  *   det nye reservasjonsobjektet.
  * */
  updateLiveReservation ({ commit }, payload) {
    firebase.firestore().collection('reservations').doc(payload.reservationID + '').update({
      numberOfPersons: payload.numberOfPersons,
      endTime: payload.endTime
    })
      .then(commit('setReservation', payload))
      .catch(error => {
        console.log('Klarte ikke å oppdatere reservasjon med ID: ' + payload.reservationID)
        console.log(error)
      })
  },
  /* updateTable brukes av tableEditor for å oppdatere bordet. */
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
  /* removeTable brukes av tableEditor for å fjerne bord */
  removeTable ({ commit }, payload) {
    commit('removeTable', payload)
    firebase.firestore().collection('tables').doc(payload.tableID + '').delete()
      .then(() => {
        console.log('Fjernet bord nr ' + payload.tableID)
      })
      .catch(error => {
        console.log('Klarte ikke å slette bordet')
        console.log(error)
      })
  },
  signUserUp ({ commit }, payload) {
  },
  /* signUserIn brukes av login for å logge inn brukeren. Først autentiserers den hos google, før vi henter dataene
  * vi har lagret på brukeren */
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
  /* signUserOut logger ut brukeren og tømmer staten på siden */
  signUserOut ({ commit }) {
    commit('setLoading', true)
    firebase.auth().signOut()
      .then(user => {
        commit('clearState')
        commit('setLoading', false)
      })
      .catch(error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
  }
}
// Getters returnerer de ulike attributtene våre fra staten. Beskrivelsen av attributten står på state objektet.
export const getters = {
  availableTables (state) {
    return state.availableTables
  },
  admin (state) {
    return state.admin
  },
  customerRequestedTables (state) {
    return state.customerRequestedTables
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
  reservation (state) {
    return state.reservation
  },
  user (state) {
    return state.user
  },
  tableAvailable (state) {
    return state.tableAvailable
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
