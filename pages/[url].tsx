import type { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import admin from 'firebase-admin'

const Url = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen pt-16 pb-12 bg-white">
      <main className="flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {router.isFallback && (
          <svg
            className="w-32 h-32 m-auto animate-spin text-oktablue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
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
                <a
                  href="/"
                  className="text-base font-medium underline text-oktablue-500 hover:text-indigo-500"
                >
                  Home<span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let data

  if (params && params.url) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: 'okturl',
        storageBucket: 'okturl.appspot.com',
        serviceAccountId:
          'firebase-adminsdk-sm9bi@okturl.iam.gserviceaccount.com',

        credential: admin.credential.cert({
          clientEmail: 'firebase-adminsdk-sm9bi@okturl.iam.gserviceaccount.com',
          privateKey: process.env.FIREBASE_ADMIN_KEY,
          projectId: 'okturl'
        })
      })
    }

    data = (
      await admin
        .firestore()
        .doc('/urls/' + params.url)
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
