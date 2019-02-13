import controller from '../components/FirebaseController'
import Vue from 'vue'
import firestore from 'firebase/firestore'

Vue.prototype.$fs = firestore
/* Vue.prototype.$signIn = uid => {
  $store.dispatch('signIn')
}

Vue.prototype.$signOut = () => {
  Vue.store.dispatch('emptyState')
} */
Vue.prototype.$controller = controller
