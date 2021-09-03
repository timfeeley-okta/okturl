import { FirebaseError } from '@firebase/util'
import admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'
export type { NextApiRequest, NextApiResponse } from 'next'

export type NextApiRequestWithUser = NextApiRequest & {
  user: string
}

export const withAuth =
  (handler: (req: any, res: any) => any) =>
  async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        serviceAccountId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        // storageBucket: process.env.NEXT_PUBLIC_PROJECT_ID + '.appspot.com',
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT,
          privateKey: process.env.FIREBASE_ADMIN_KEY
        })
      })
    }

    const token =
      (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
      (req.cookies && req.cookies.idt) ||
      null
    if (!token) {
      return res.status(401).json({ error: 'auth/not-authenticated' })
    }

    let decodedToken
    try {
      decodedToken = await admin.auth().verifyIdToken(token)

      if (!decodedToken || !decodedToken.uid)
        return res.status(401).json({ error: 'auth/not-authenticated' })
      req.user = JSON.stringify(decodedToken)
    } catch (error) {
      const refreshToken = req.cookies && req.cookies.rft
      if (
        refreshToken &&
        (error as FirebaseError).code === 'auth/id-token-expired'
      ) {
        req.user = JSON.stringify(await refreshExpiredIdToken(refreshToken))
      } else {
        return res.status(401).json({ error: error })
      }
    }

    return handler(req, res)
  }

const refreshExpiredIdToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error('The "refreshToken" argument is required.')
  }

  const endpoint =
    'https://securetoken.googleapis.com/v1/token?key=' +
    process.env.NEXT_PUBLIC_API_KEY

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=refresh_token&refresh_token=' + refreshToken
  })
  const responseJSON = await response.json()
  if (!response.ok) {
    throw new Error(`Problem refreshing token: ${JSON.stringify(responseJSON)}`)
  }

  const idToken = responseJSON.id_token

  return await admin.auth().verifyIdToken(idToken)
}
