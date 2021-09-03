import { useFormik } from 'formik'
import { useFirebaseAuth } from 'providers/Firebase'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button, ConfirmationList, Field, Layout } from '@/components/index'
import withFirebaseIdToken from '@/hooks/withIdToken'
import Brand from '@/lib/brand'
import { re_alpha_numeric, re_js_rfc3986_URI } from '@/lib/validation'

type FormValues = {
  id: number
  url: string
  key: string
}

const IndexPage = () => {
  const auth = useFirebaseAuth()

  const autoFocusRef = useRef<HTMLInputElement>(null)
  const [confirmations, setConfirmations] = useState<Partial<FormValues>[]>([])

  const addConfirmation = useCallback(
    ({ key, url }: Partial<FormValues>) => {
      setConfirmations((confirmations) => [
        ...confirmations,
        {
          id: new Date().valueOf(),
          key,
          url
        }
      ])
    },
    [setConfirmations]
  )

  const removeConfirmation = useCallback(
    (id: number) => {
      setConfirmations((confirmations) =>
        confirmations.filter((t) => t.id !== id)
      )
    },
    [setConfirmations]
  )

  useEffect(() => {
    autoFocusRef?.current?.focus()
  }, [autoFocusRef])

  const request = async (values: Partial<FormValues>, token: string) =>
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(values)
    })

  const form = useFormik({
    initialValues: { url: '', key: '' },
    validateOnChange: false,
    validate: ({ url, key }) => {
      const errors: { url?: string; key?: string } = {}

      if (!url) errors.url = 'url is required'
      else if (url && !re_js_rfc3986_URI.test(url))
        errors.url = 'url is invalid'
      else if (key && !re_alpha_numeric.test(key))
        errors.key = 'must be alphanumeric'

      return errors
    },
    onSubmit: async (values, { setErrors }) =>
      withFirebaseIdToken(request.bind(false, values))
        .then(async (response) => {
          if (response.ok) {
            addConfirmation && addConfirmation(response)
            return Promise.resolve()
          } else {
            const { field, message } = await response.json()
            setErrors({ [field]: message })
            return Promise.resolve()
          }
        })
        .catch((e) => {
          alert(e)
        })
  })

  return (
    <Layout.Outer>
      <Brand.Logo onClick={auth?.signIn} className="w-24 mx-auto mb-8" />
      <Layout.Card>
        <form onSubmit={form.handleSubmit} className="space-y-6">
          <Field
            id="url"
            ref={autoFocusRef}
            label="url"
            type="url"
            placeholder="John"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.url}
            value={form.values.url}
          />
          <Field
            type="text"
            id="key"
            label="key"
            placeholder="Doe"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.key}
            error={form.errors.key}
          />

          <Button disabled={form.isSubmitting} type="submit">
            Submit
          </Button>
        </form>
      </Layout.Card>
      {confirmations.length > 0 && (
        <Layout.SmallerCard className="mt-4">
          <ConfirmationList
            data={confirmations as FormValues[]}
            removeConfirmation={removeConfirmation}
          />
        </Layout.SmallerCard>
      )}
    </Layout.Outer>
  )
}
export default IndexPage
