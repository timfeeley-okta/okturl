import { createRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import { XIcon } from '@heroicons/react/outline'

import Head from 'next/head'

import { re_alpha_numeric, re_js_rfc3986_URI } from '../lib/validation'
import { useAuth } from '@/lib/auth'
import BlockedButton from '@/components/BlockedButton'
import Button from '@/components/Button'

const Home = () => {
  const [canSubmit, setCanSubmit] = useState(true)
  const auth = useAuth()
  const resultUrlRef = createRef<HTMLParagraphElement>()

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
              toast.error(data.error)
            } else {
              toast.success(data.prefix)
            }
          })
        })
        .catch((error) => {
          toast.error(error)
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
        <Toaster
          toastOptions={{ duration: Infinity }}
          position="top-center"
          reverseOrder={false}>
          {(t) => (
            <ToastBar toast={t}>
              {({ icon }) => (
                <div className="flex items-center w-96">
                  <span className="block my-3 ml-3">{icon}</span>
                  <div className="flex-grow my-3 ml-4 text-sm">
                    {t.type === 'success' && (
                      <p className="font-bold">Shortened URL:</p>
                    )}
                    <p
                      ref={resultUrlRef}
                      className="overflow-hidden text-xs text-gray-500 max-w-tooltip overflow-ellipsis whitespace-nowrap">
                      {t.message}
                    </p>
                  </div>
                  <div className="self-stretch p-0 rounded-md bg-gray-50">
                    {t.type === 'success' && (
                      <button
                        className="h-full text-sm text-blue-500 border-r w-14"
                        onClick={() => {
                          resultUrlRef.current &&
                            window
                              .getSelection()
                              ?.selectAllChildren(resultUrlRef.current)
                          document.execCommand('copy')
                          toast('Copied to clipboard!', {
                            duration: 1000
                          })
                          toast.dismiss(t.id)
                        }}>
                        Copy
                      </button>
                    )}
                    <button
                      className="w-10 h-full text-sm text-blue-500 "
                      onClick={() => toast.dismiss(t.id)}>
                      <XIcon className="inline w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </ToastBar>
          )}
        </Toaster>
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
                <BlockedButton
                  block={auth.user === null}
                  buttonThatBlocks={
                    <Button
                      theme="ALT_FILLED"
                      onClick={auth.signIn}
                      className="w-full text-center"
                      size="XL">
                      Sign in with Google
                    </Button>
                  }
                  buttonToBlock={
                    <Button
                      type="submit"
                      size="XL"
                      className="w-full"
                      disabled={!canSubmit || auth.user === null}>
                      Submit
                    </Button>
                  }>
                  <p className="text-sm font-bold text-green-800">
                    This verifies you’re an Okta employee via Google
                  </p>
                </BlockedButton>
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
