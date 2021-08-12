import { FC, useState, useEffect, useContext, createContext } from 'react'
import init from '../lib/firebase'
import {
  User,
  GoogleAuthProvider,
  signInWithCredential,
  onIdTokenChanged,
  signOut as firebaseSignOut
} from 'firebase/auth'
import nookies from 'nookies'

type AuthContextType = {
  signIn?: () => Promise<unknown>
  signOut?: () => Promise<unknown>
  user?: User | null
}

const AuthContext = createContext<AuthContextType>({})

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const auth = init()

  const signInFromGapi = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!auth) {
        reject()
        return false
      }
      if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        const { id_token, access_token } = window.gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse(true)

        const credential = GoogleAuthProvider.credential(id_token, access_token)

        signInWithCredential(auth, credential)
          .then(({ user }) => {
            console.log('User is authenticated as ', user && user.uid)
          })
          .catch((e) => {
            reject(e)
          })
      } else {
        setUser(null)
        resolve()
      }
    })
  }

  const signOut = async () => {
    window.gapi.auth2.getAuthInstance().signOut()

    auth &&
      firebaseSignOut(auth).then(() => {
        setUser(null)
        nookies.destroy(null, 'token')
        nookies.set(null, 'token', '', { path: '/' })
        document.location.reload()
      })
  }

  const signIn = async () => {
    return new Promise((resolve, reject) => {
      window.gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(signInFromGapi.bind(this, [true]))
        .then(resolve)
        .catch(reject)
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.nookies = nookies
    }

    return (
      auth &&
      onIdTokenChanged(auth, async (user) => {
        if (!user) {
          setUser(null)

          nookies.destroy(null, 'token')
          nookies.set(null, 'token', '', { path: '/' })
          return
        }

        const token = await user.getIdToken()
        setUser(user)

        nookies.destroy(null, 'token')
        nookies.set(null, 'token', token, { path: '/' })
      })
    )
  }, [auth])

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth && auth.currentUser

      if (user) await user.getIdToken(true)
    }, 10 * 60 * 1000)
    return () => clearInterval(handle)
  }, [auth])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
