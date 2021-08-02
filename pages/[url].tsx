import { Client, query as q } from 'faunadb'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

type ResponseType = {
  data?: {
    originalUrl: string
    shortUrl: string
  }
  description?: string
}

const Url = ({ url }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {router.isFallback && (
          <svg
            className="animate-spin m-auto h-32 w-32 text-oktablue-500"
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
              <h2 className="mt-2 text-red-500 text-4xl font-extrabold  tracking-tight sm:text-5xl">
                404 {url}
              </h2>
              <p className="mt-2 text-base text-gray-500">
                Sorry, there’s no short url for{' '}
                <code className="font-mono font-semibold">{router.asPath}</code>
              </p>
              <div className="mt-6">
                <a
                  href="/"
                  className="text-base underline font-medium text-oktablue-500 hover:text-indigo-500"
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
  const client = new Client({
    secret: process.env.FAUNA_KEY || ''
  })

  let response: ResponseType = {}
  if (params && params.url) {
    try {
      response = await client.query(
        q.Get(q.Match(q.Index('unique_shorturl'), params.url))
      )
    } catch (e) {
      response = e
    }
  }
  return {
    props: {},
    ...(response &&
      response.data &&
      response.data.originalUrl && {
        redirect: { destination: response.data.originalUrl }
      }),
    ...(response &&
      response.description && {
        notFound: true
      }),
    revalidate: 10
  }
}

export default Url
