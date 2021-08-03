import nookies from 'nookies'

declare global {
  interface Window {
    gapi: typeof gapi
    nookies: typeof nookies
  }
}
