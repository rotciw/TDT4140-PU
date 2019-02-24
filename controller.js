import * as firebase from 'firebase/app'
import 'firebase/firestore'

let fs = firebase.firestore()

export const users = {
  getUser (uid) {
    fs.collection('users').doc(uid + '').get()
      .then(user => {
        user = user.data()
        console.log(user)
        return user
      })
      .catch(error => {
        console.log('Klarte ikke å hente bruker med uid: ' + uid)
        console.log(error)
      })
  }
}
