import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCqHyzM-cCJS5Em26Twj7zwqYblihUw03g',
  authDomain: 'okturl.firebaseapp.com',
  projectId: 'okturl',
  storageBucket: 'okturl.appspot.com',
  messagingSenderId: '176675371954',
  appId: '1:176675371954:web:3ad50bd1025328e236c2ab'
}

const init = () => {
  if (typeof window !== 'undefined' && !getApps().length) {
    initializeApp(firebaseConfig)
    const auth = getAuth()
    setPersistence(auth, browserSessionPersistence)

    return auth
  }
}
export default init
