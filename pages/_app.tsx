import 'tailwindcss/tailwind.css'

import { useEffect } from 'react'

import { AuthProvider } from '../lib/auth'
import { insertGapi } from '../lib/gapi'

import type { AppProps } from 'next/app'
const Okturl = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    insertGapi()
  }, [])
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default Okturl
