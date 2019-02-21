import firebase from 'firebase/app'
import 'firebase/firestore'
import controller from '../components/FirebaseController'
import Vue from 'vue'

Vue.prototype.$fs = firebase.firestore()
/* Vue.prototype.$signIn = uid => {
  $store.dispatch('signIn')
}

Vue.prototype.$signOut = () => {
  Vue.store.dispatch('emptyState')
} */
Vue.prototype.$controller = controller
