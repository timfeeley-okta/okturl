import admin from 'firebase-admin'

import {
  NextApiRequestWithUser,
  NextApiResponse,
  withAuth
} from '@/hooks/withAuth'
import { re_alpha_numeric, re_js_rfc3986_URI } from '@/lib/validation'

const err = (res: NextApiResponse, field: any, message: any) => {
  res.status(400).json({ field, message })
  return false
}

const prefix = (key: string, host?: string) =>
  'http' + (host !== 'localhost:3000' ? 's' : '') + '://' + host + '/' + key

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  try {
    const token: admin.auth.DecodedIdToken = JSON.parse(req.user)

    if (req.method === 'POST') {
      if (req.body && !!req.body.url && typeof req.body.url === 'string') {
        if (!re_js_rfc3986_URI.test(req.body.url)) {
          return err(res, 'url', 'url is invalid')
        }

        const key: string =
          req.body && !!req.body.key && typeof req.body.key === 'string'
            ? req.body.key
            : Math.random().toString(36).substr(2)

        if (!re_alpha_numeric.test(key)) {
          return err(res, 'key', 'code must be alphanumeric')
        }

        if (
          (await admin.firestore().collection('urls').doc(key).get()).exists
        ) {
          return err(res, 'key', 'this code already exists')
        } else {
          await admin
            .firestore()
            .collection('urls')
            .doc(key)
            .set({
              url: req.body.url,
              owner: token.uid
            })
            .then((value) =>
              res.status(200).json({
                success: value.writeTime,
                url: req.body.url,
                key: prefix(key, req.headers.host)
              })
            )
            .catch((error) =>
              err(res, 'firebase', error || 'Unknown firebase error')
            )
        }
      } else {
        return err(res, 'url', 'no URL given to shorten')
      }
    } else if (req.method === 'GET') {
      if (req.query && req.query.key && typeof req.query.key === 'string') {
        await admin
          .firestore()
          .collection('urls')
          .doc(req.query.key)
          .get()
          .then((value) => {
            res.status(200).json({
              result: value.data(),
              prefix: prefix(req.query.key as string, req.headers.host)
            })
          })
          .catch((error) =>
            err(res, 'firebase', error || 'Unknown firebase error')
          )
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export default withAuth(handler)
