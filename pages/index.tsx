import React, { createRef, useState } from 'react'
import { ClipboardIcon, XCircleIcon } from '@heroicons/react/solid'
import Head from 'next/head'
import url from 'url'

const Home = () => {
  const shortUrl = createRef<HTMLInputElement>()
  const longUrl = createRef<HTMLInputElement>()
  const resultUrlRef = createRef<HTMLInputElement>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [resultUrl, setResultUrl] = useState('')
  const [errorState, setErrorState] = useState('')

  const getShortUrl: React.FormEventHandler = (e) => {
    if (!isLoading && longUrl.current && shortUrl.current) {
      setErrorState('')
      setResultUrl('')
      setLoading(true)
      const longUrlValue = longUrl.current.value
      let p = url.parse(longUrlValue)
      if (!p.slashes) p = url.parse('http://' + longUrlValue)
      else if (!p.protocol) p = url.parse('http:' + longUrlValue)
      longUrl.current.value = p.href

      fetch('/api/createUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalUrl: longUrl.current.value,
          shortUrl: shortUrl.current.value
        })
      })
        .then(async (response) => {
          const data = await response.json()
          console.log(data)
          if (data.error) {
            setErrorState(
              data.error.message.replace('instance', 'requested short URL')
            )
          } else {
            setResultUrl(data.prefix + data.data.shortUrl)
            if (longUrl.current) longUrl.current.value = ''
            if (shortUrl.current) shortUrl.current.value = ''
          }
        })
        .catch((error) => {
          setErrorState('Fetch error: ' + error)
        })
        .finally(() => setLoading(false))
    }

    e.preventDefault()
    return false
  }
  return (
    <section className="py-10 lg:py-20">
      <Head>
        <title>okturl shortener</title>
      </Head>
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="mb-10">
            <a className="text-3xl font-bold leading-none" href="#">
              <img
                className="h-12 mx-auto"
                src="atis-assets/logo/atis/atis-mono-black.svg"
                alt=""
                width="auto"
              />
            </a>
          </div>
          <div className="p-6 lg:p-12 mb-6 bg-white shadow rounded">
            <div className="mb-6">
              <span className="text-gray-500">okturl</span>
              <h3 className="text-2xl font-bold">Shorten a URL</h3>
            </div>
            <form onSubmit={getShortUrl}>
              <div className="mb-3 flex p-4 bg-gray-50 rounded focus-within:ring-2 focus-within:ring-oktablue-50">
                <input
                  autoCapitalize="false"
                  autoComplete="false"
                  autoCorrect="false"
                  className="w-full bg-gray-50 outline-none"
                  type="url"
                  ref={longUrl}
                  placeholder="URL to shorten"
                />
              </div>

              <div className="mb-6 flex p-4 bg-gray-50 relative rounded">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-black">https://okturl.com/</span>
                </div>
                <input
                  className=" block w-full pl-34 bg-gray-50 outline-none"
                  ref={shortUrl}
                  type="text"
                  placeholder="optional"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="mb-2 w-full py-4 bg-oktablue-500 hover:bg-oktablue-50 rounded font-bold text-gray-50 transition duration-200"
                >
                  Shorten
                </button>
              </div>
              {errorState && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Couldn’t shorten the URL:
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {errorState}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {resultUrl && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex items-center">
                    <div
                      ref={resultUrlRef}
                      className="ml-3 text-sm select-all "
                    >
                      {resultUrl}
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="flex focus-within:ring-2 rounded-md focus-within:ring-offset-2 focus-within:ring-offset-green-50 focus-within:ring-green-600 group justify-center items-center self-center">
                        {copied && (
                          <span className="text-xs text-green-500 font-bold relative ml-2">
                            Copied!
                          </span>
                        )}
                        <button
                          type="button"
                          className="bg-green-50 group-hover:bg-green-100  p-1.5 text-green-500 focus:outline-none "
                          onClick={() => {
                            if (resultUrlRef.current) {
                              const r = document.createRange()
                              r.selectNode(resultUrlRef.current)
                              window.getSelection()?.removeAllRanges()
                              window.getSelection()?.addRange(r)
                              document.execCommand('copy')
                              setCopied(true)
                              window.setTimeout(setCopied.bind(false), 1500)
                            }
                          }}
                        >
                          <span className="sr-only">Copy</span>
                          <ClipboardIcon
                            className="h-5 w-5 block"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          <p className="text-xs text-center text-gray-400">
            An unofficial{' '}
            <a
              className="underline hover:text-gray-500"
              href="https://github.com/timfeeley-okta/okturl"
            >
              side project
            </a>{' '}
            from{' '}
            <a
              className="underline hover:text-gray-500"
              href="mailto:tim.feeley@okta.com"
            >
              Tim Feeley
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Home
