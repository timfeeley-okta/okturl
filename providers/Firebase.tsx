import { getApps, initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth'
import { createContext, FC, useContext, useEffect, useState } from 'react'

type ContextState = {
  user: User | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
} | null

export const FirebaseAuthContext = createContext<ContextState>(null)

if (getApps().length === 0) {
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID
  })
  setPersistence(getAuth(), browserLocalPersistence)
}

export const FirebaseAuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const authState = getAuth()

  useEffect(
    () => onAuthStateChanged(authState, (user) => setUser(user)),
    [authState]
  )

  const signOut = async () => {
    if (getAuth().currentUser) {
      return firebaseSignOut(getAuth())
    }
  }

  const signIn = async () => {
    const authProvider = new GoogleAuthProvider()
    authProvider.addScope('email')
    signInWithPopup(getAuth(), authProvider)
      .then((result) => {
        result.user.getIdToken().then((token) => {
          fetch('/api/auth', {
            headers: {
              Authorization: 'Bearer ' + token
            }
          })

          const user = result.user
        })
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  return (
    <FirebaseAuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export const useFirebaseAuth = () => useContext(FirebaseAuthContext)
