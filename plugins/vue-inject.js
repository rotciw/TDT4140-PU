import controller from '../components/FirebaseController'
import Vue from 'vue'
import { firestore } from '../components/Configuration'
import store from '../store/index.js'

Vue.prototype.$fs = firestore
Vue.prototype.$signIn = uid => {
  store.dispatch('signIn')
}

Vue.prototype.$signOut = () => {
  store.dispatch('emptyState')
}

Vue.prototype.$controller = controller
