import firebase from 'firebase'

// Checks if the user already logged in and the token is still active
export default ({ app: { store, router } }) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.dispatch('autoSignIn', user)
    }
  })
}
