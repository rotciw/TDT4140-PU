export const state = () => ({
  user: null
})

export const mutations = {
  createMeetup (state, payload) {
    state.loadedMeetups.push(payload)
  },
  setUser (state, payload) {
    state.user = payload
  }
}
export const actions = {
  signUserUp ({ commit }, payload) {
  },
  signUserIn ({ commit }, payload) {
  }
}
export const getters = {
  user (state) {
    return state.user
  }
}
