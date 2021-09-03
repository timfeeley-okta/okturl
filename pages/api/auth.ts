import admin from 'firebase-admin'
import { setCookie } from 'nookies'

import {
  NextApiRequestWithUser,
  NextApiResponse,
  withAuth
} from '@/hooks/withAuth'

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  try {
    const token: admin.auth.DecodedIdToken = JSON.parse(req.user)
    const customToken = await admin.auth().createCustomToken(token.uid)

    const refreshTokenEndpoint =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' +
      process.env.NEXT_PUBLIC_API_KEY

    const refreshTokenResponse = await fetch(refreshTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true
      })
    })
    const refreshTokenJSON = await refreshTokenResponse.json()
    if (!refreshTokenResponse.ok) {
      throw new Error(
        `Problem getting a refresh token: ${JSON.stringify(refreshTokenJSON)}`
      )
    }
    const { idToken, refreshToken } = refreshTokenJSON

    setCookie({ res }, 'idt', idToken, {
      maxAge: 30 * 24 * 60 * 60
    })
    setCookie({ res }, 'rft', refreshToken, {
      maxAge: 30 * 24 * 60 * 60
    })

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(400).json({ error: e })
  }
}

export default withAuth(handler)
