import firebase from 'firebase/app'
import 'firebase/firestore'

export const state = () => ({
  user: null
})

export const mmutations = {
  setUser (state, payload) {
    state.loadedMeetups.push(payload)
  }
}
export const actions = {
  signUserIn ({ commit }, payload) {
  }
}
export const getters = {
  user (state) {
    return state.user
  }
}
