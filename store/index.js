import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export const state = () => ({
  user: null
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  }
}
export const actions = {
  signUserIn ({ commit }, payload) {
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            id: user.uid
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          console.log(error)
        }
      )
  }
}
export const getters = {
  user (state) {
    return state.user
  }
}
