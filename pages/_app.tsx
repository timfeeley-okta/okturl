import 'tailwindcss/tailwind.css'

import { AppProps } from 'next/app'
import { FirebaseAuthProvider } from 'providers/Firebase'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <FirebaseAuthProvider>
      <Component {...pageProps} />
    </FirebaseAuthProvider>
  )
}

export default App
