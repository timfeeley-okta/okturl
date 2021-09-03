import { getAuth } from 'firebase/auth'

const withFirebaseIdToken = async <T>(fn: (token: string) => Promise<T>) => {
  return new Promise<T>((resolve, reject) => {
    const currentUser = getAuth().currentUser
    if (!currentUser) {
      return reject('unauthenticated')
    }
    console.log(currentUser, fn)
    currentUser
      .getIdToken(true)
      .then((user) => resolve(fn(user)))
      .catch((error) => reject(error))
  })
}

export default withFirebaseIdToken
