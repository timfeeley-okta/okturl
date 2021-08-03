import type { NextApiRequest, NextApiResponse } from 'next'
import { generate } from 'randomstring'
import admin from 'firebase-admin'
import { re_alpha_numeric, re_js_rfc3986_URI } from '../../lib/validation'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: 'okturl',
      storageBucket: 'okturl.appspot.com',
      serviceAccountId:
        'firebase-adminsdk-sm9bi@okturl.iam.gserviceaccount.com',

      credential: admin.credential.cert({
        clientEmail: 'firebase-adminsdk-sm9bi@okturl.iam.gserviceaccount.com',
        privateKey: process.env.FIREBASE_ADMIN_KEY,
        projectId: 'okturl'
      })
    })
  }

  if (req.method === 'POST') {
    if (req.body && !!req.body.url && typeof req.body.url === 'string') {
      if (!re_js_rfc3986_URI.test(req.body.url)) {
        res
          .status(400)
          .json({ error: { message: req.query.url + ' is an invalid url' } })
        return false
      }

      const key: string =
        req.body && !!req.body.key && typeof req.body.key === 'string'
          ? req.body.key
          : generate({
              length: 11,
              capitalization: 'lowercase',
              charset: 'hex'
            })

      if (!re_alpha_numeric.test(key)) {
        res.status(400).json({
          error: {
            message: key + ' can only use letters numbers and underscores'
          }
        })
        return false
      }

      if ((await admin.firestore().collection('urls').doc(key).get()).exists) {
        res.status(401).json({ error: key + ' exists' })
      } else {
        await admin
          .firestore()
          .collection('urls')
          .doc(key)
          .set({
            url: req.body.url
          })
          .then((value) =>
            res.status(200).json({
              success: value.writeTime,
              prefix:
                'http' +
                (req.headers.host !== 'localhost:3000' ? 's' : '') +
                '://' +
                req.headers.host +
                '/' +
                key
            })
          )
          .catch((error) => {
            res.status(500).json({ error: error || 'unknown Firebase error' })
          })
      }
    } else {
      res.status(400).send({
        error: 'missing `url` in body'
      })
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
            prefix:
              'http' +
              (req.headers.host !== 'localhost:3000' ? 's' : '') +
              '://' +
              req.headers.host +
              '/'
          })
        })
        .catch((error) => {
          res.status(500).json({ error: error || 'unknown Firebase error' })
        })
    }
    // Handle any other HTTP method
  }
}
