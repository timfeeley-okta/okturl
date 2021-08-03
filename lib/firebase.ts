import firebaseClient from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCqHyzM-cCJS5Em26Twj7zwqYblihUw03g',
  authDomain: 'okturl.firebaseapp.com',
  projectId: 'okturl',
  storageBucket: 'okturl.appspot.com',
  messagingSenderId: '176675371954',
  appId: '1:176675371954:web:3ad50bd1025328e236c2ab'
}

if (typeof window !== 'undefined' && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(firebaseConfig)
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION)
}

export default firebaseClient
