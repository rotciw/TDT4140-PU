import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

let config = {
  apiKey: 'AIzaSyA6qBEDMWc2cJ5Y7xDKKNWiK3XDC9FbaJg',
  authDomain: 'pu30-5b0f9.firebaseapp.com',
  adatabaseURL: 'https://pu30-5b0f9.firebaseio.com',
  projectId: 'pu30-5b0f9',
  storageBucket: 'pu30-5b0f9.appspot.com',
  messagingSenderId: '607415686100'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
