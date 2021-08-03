import { createRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import cx from 'classnames'
import Head from 'next/head'

import { re_alpha_numeric, re_js_rfc3986_URI } from '../lib/validation'
import { useAuth } from '../lib/auth'

const Spinner = (
  <svg
    className="w-6 h-6 m-auto animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const Home = () => {
  const [canSubmit, setCanSubmit] = useState(true)
  const auth = useAuth()
  const resultUrlRef = createRef<HTMLParagraphElement>()

  const sendToast = (success: boolean, details: string) => {
    toast.custom(
      (t) => (
        <div
          className={cx(
            'max-w-md w-full shadow-lg bg-white rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
            {
              'animate-enter': t.visible,
              'animate-leave': !t.visible
            }
          )}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-1 ml-3">
                <p
                  className={cx('text-sm font-bold', {
                    'text-green-900': success,
                    'text-red-900': !success
                  })}>
                  {success ? 'Success!' : 'Sorry'}
                </p>
                <p ref={resultUrlRef} className="mt-1 text-xs text-gray-500">
                  {details}
                </p>
              </div>
            </div>
          </div>
          {success && (
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  resultUrlRef.current &&
                    window
                      .getSelection()
                      ?.selectAllChildren(resultUrlRef.current)
                  document.execCommand('copy')
                  toast('Copied the URL to the clipboard', { duration: 1000 })
                  toast.dismiss(t.id)
                }}
                className="flex items-center justify-center w-full p-4 text-sm font-medium text-blue-600 border border-transparent rounded-none rounded-r-lg hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Copy
              </button>
            </div>
          )}
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex items-center justify-center w-full p-4 text-sm font-medium text-blue-600 border border-transparent rounded-none rounded-r-lg hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Close
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity
      }
    )
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{
    url: string
    key: string
  }>()

  const onSubmit = handleSubmit((data, e) => {
    if (canSubmit) {
      setCanSubmit(false)
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((result) => {
          result.json().then((data) => {
            if (data.error) {
              sendToast(false, data.error)
            } else {
              sendToast(true, data.prefix)
            }
          })
        })
        .catch((error) => {
          sendToast(false, error)
        })
        .finally(() => setCanSubmit(true))
    }
    e && e.preventDefault()
    return false
  })

  return (
    <section className="py-10 lg:py-20">
      <Head>
        <title>okturl shortener</title>
      </Head>
      <div className="container px-4 mx-auto">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="max-w-xl mx-auto">
          <div className="p-6 mb-6 bg-white rounded shadow lg:p-12">
            <div className="mb-6">
              <span className="text-gray-500">okturl</span>
              <h3 className="text-2xl font-bold">Shorten a URL</h3>
            </div>
            <form onSubmit={onSubmit}>
              <div className="flex p-4 rounded bg-gray-50 focus-within:ring-2 focus-within:ring-oktablue-50">
                <input
                  autoCapitalize="false"
                  autoComplete="false"
                  autoCorrect="false"
                  className="w-full outline-none bg-gray-50"
                  type="text"
                  {...register('url', {
                    setValueAs: (v) =>
                      v && !v.startsWith('http://') && !v.startsWith('https://')
                        ? 'http://' + v
                        : v,
                    required: 'Please enter the URL to shorten',
                    pattern: {
                      value: re_js_rfc3986_URI,
                      message: 'Please enter a valid URL'
                    }
                  })}
                  placeholder="URL to shorten"
                />
              </div>
              {errors.url?.message && (
                <p className="mt-1 ml-2 text-red-500">
                  <span role="img" aria-label="Error">
                    ⛔️
                  </span>{' '}
                  {errors.url?.message}
                </p>
              )}
              <div className="relative flex p-4 mt-4 rounded bg-gray-50">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-black">https://okturl.com/</span>
                </div>
                <input
                  className="block w-full outline-none pl-34 bg-gray-50"
                  type="text"
                  placeholder="optional"
                  {...register('key', {
                    pattern: {
                      value: re_alpha_numeric,
                      message:
                        'Only letters, numbers and underscores are allowed'
                    }
                  })}
                />
              </div>
              {errors.key?.message && (
                <p className="mt-1 ml-2 text-red-500">
                  <span role="img" aria-label="Error">
                    ⛔️
                  </span>{' '}
                  {errors.key?.message}
                </p>
              )}
              <div className="mt-6 text-center">
                <button
                  type="submit"
                  disabled={!canSubmit && auth.user !== null}
                  className={cx(
                    'w-full py-4 mb-2 font-bold transition duration-200 rounded',
                    {
                      'bg-gray-200  text-gray-400': auth.user === null,
                      'bg-oktablue-500 hover:bg-oktablue-50 text-gray-50':
                        canSubmit && auth.user !== null
                    }
                  )}>
                  {canSubmit ? 'Shorten' : Spinner}
                </button>

                {!auth.user && (
                  <div className="relative -mt-5 filter shadow-cover ">
                    <button
                      type="button"
                      className="w-full py-4 mb-2 font-bold transition duration-200 bg-green-500 rounded text-gray-50"
                      onClick={auth.signIn}>
                      Sign in with Google
                    </button>
                    <p className="text-sm font-bold text-green-800">
                      This verifies you’re an Okta employee via Google
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
          <p className="text-xs text-center text-gray-400">
            An unofficial{' '}
            <a
              className="underline hover:text-gray-500"
              href="https://github.com/timfeeley-okta/okturl">
              side project
            </a>{' '}
            from{' '}
            <a
              className="underline hover:text-gray-500"
              href="mailto:tim.feeley@okta.com">
              Tim Feeley
            </a>
          </p>
          <p className="mt-2 text-xs text-center text-gray-400">
            {auth.user && auth.user.email !== null && (
              <>
                <span>
                  Signed in via Google as {auth.user.email.split('@')[0]}
                </span>{' '}
                <button className="underline" onClick={auth.signOut}>
                  sign out
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Home
