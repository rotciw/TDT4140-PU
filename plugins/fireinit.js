import firebase from 'firebase/app'
import Vue from 'vue'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

// Sets up firestore
let config = {
  apiKey: 'AIzaSyA6qBEDMWc2cJ5Y7xDKKNWiK3XDC9FbaJg',
  authDomain: 'pu30-5b0f9.firebaseapp.com',
  databaseURL: 'https://pu30-5b0f9.firebaseio.com',
  projectId: 'pu30-5b0f9',
  storageBucket: 'pu30-5b0f9.appspot.com',
  messagingSenderId: '607415686100'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()

Vue.prototype.$fs = StoreDB
