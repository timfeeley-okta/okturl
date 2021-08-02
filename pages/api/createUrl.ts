import type { NextApiRequest, NextApiResponse } from 'next'
import { generate } from 'randomstring'
import { Client, query } from 'faunadb'
import url from 'url'

const client = new Client({
  secret: process.env.FAUNA_KEY || ''
})
function isValidHttpUrl(str: string) {
  let url

  try {
    url = new URL(str)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { originalUrl } = req.body
  const { shortUrl } = req.body

  let p = url.parse(originalUrl)
  if (!p.slashes) p = url.parse('http://' + originalUrl)
  else if (!p.protocol) p = url.parse('http:' + originalUrl)
  originalUrl = p.href

  if (!isValidHttpUrl(originalUrl)) {
    res.status(200).json({ error: { message: 'URL to shorten is invalid' } })
    return false
  }

  const finalUrl: string =
    shortUrl ||
    generate({
      length: 11,
      capitalization: 'lowercase',
      charset: 'hex'
    })

  const validUrl = new RegExp('^([A-z0-9-])+$')
  if (!validUrl.test(finalUrl)) {
    res.status(200).json({
      error: { message: 'Please use only numbers, letters and underscores' }
    })
    return false
  }

  await client
    .query(
      query.Create(query.Collection('urls'), {
        data: {
          originalUrl,
          shortUrl: finalUrl
        }
      })
    )
    .then((value) => {
      res.status(200).json({
        prefix:
          'http' +
          (req.headers.host !== 'localhost:3000' ? 's' : '') +
          '://' +
          req.headers.host +
          '/',
        ...value
      })
    })
    .catch((error) => {
      res.status(200).json({ error: error })
    })
}
