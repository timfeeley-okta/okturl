import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'

const Okturl = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default Okturl
