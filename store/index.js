import firebase from 'firebase/app'
import 'firebase/firestore'
import Vue from 'vue'

export const state = () => ({
  admin: false,
  employee: false,
  error: null,
  loading: false,
  tables: [],
  user: null
})

// Mutations are functions that the store uses to set its atrributes
export const mutations = {
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
  },
  // Fjerner bordet fra staten
  removeTable (state, payload) {
    Vue.set(state.tables, payload.tableID - 1, null)
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
  setError (state, payload) {
    state.error = payload
  }
}
// Actions are actions ran by the store. They are callable with this.$store.dispatch('actionnavn')
export const actions = {
  // Autosigns in the user if the session is still valid
  autoSignIn ({ commit, dispatch }, payload) {
    firebase.firestore().collection('users').doc(payload.uid).get()
      .then(user => {
        user = user.data()
        commit('setUser', user)
        dispatch('mountTables')
      })
      .catch(error => {
        console.log(error)
      })
  },
  clearError ({ commit }) {
    commit('clearError')
  },
  clearState ({ commit }) {
    commit('clearState')
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
  }
}
