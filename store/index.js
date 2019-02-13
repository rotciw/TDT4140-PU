import * as firebase from 'firebase'

export const state = () => ({
  user: null,
  loading: false,
  error: null
})

export const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  clearError (state, payload) {
    state.error = null
  }
}
export const actions = {
  clearError ({ commit }) {
    commit('clearError')
  },
  signUserUp ({ commit }, payload) {
  },
  signUserIn ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit('setLoading', false)
        user = user.data()
        commit('setUser', user)
      })
      .catch(error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
  }
}
export const getters = {
  error (state) {
    return state.error
  },
  user (state) {
    return state.user
  }
}
