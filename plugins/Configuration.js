// Check URI. Connect to the corresponding configuration.
const activeConfig = window.activeConfig,
      firebaseApp = window.firebase

export const API = activeConfig.API
export const auth = firebaseApp.auth()
export const db = firebaseApp.database()
export const firestore = firebaseApp.firestore()
export const environment = activeConfig.projectId
export const providers = window.firebase.auth
export const storage = firebaseApp.storage()

firestore.settings({ timestampsInSnapshots: true })
