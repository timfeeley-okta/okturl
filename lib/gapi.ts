export const insertGapi = (gapiCallback?: () => void) => {
  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/platform.js'
  script.async = true
  script.defer = true

  script.onload = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: 'email'
        })
        .then(() => {
          if (gapiCallback) gapiCallback()
        })
    })
  }
  document.head.appendChild(script)
}
