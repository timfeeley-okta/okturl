import admin from 'firebase-admin'
import type { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Layout from '@/components/Layout'

const Url = () => {
  const router = useRouter()

  return (
    <Layout.Outer>
      <main className="flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {router.isFallback && (
          <svg
            className="w-16 h-16 m-auto animate-spin text-indigo-800"
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
        )}
        {!router.isFallback && (
          <div className="py-16">
            <div className="text-center">
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-red-500 sm:text-5xl">
                Not found
              </h2>
              <p className="mt-2 text-base text-gray-500">
                Sorry, there’s no short url for{' '}
                <code className="font-mono font-semibold">{router.asPath}</code>
              </p>
              <div className="mt-6">
                <Link href="/">
                  <a className="text-base font-medium underline text-indigo-700 hover:text-indigo-500">
                    Home<span aria-hidden="true"> &rarr;</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout.Outer>
  )
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let data

  if (params && params.key) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        serviceAccountId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,

        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT,
          privateKey: process.env.FIREBASE_ADMIN_KEY
        })
      })
    }

    data = (
      await admin
        .firestore()
        .doc('/urls/' + params.key)
        .get()
    ).data()
  }

  return {
    props: {},
    ...(data &&
      typeof data !== 'undefined' &&
      data.url && {
        redirect: { destination: data.url }
      }),

    revalidate: 10
  }
}

export default Url
