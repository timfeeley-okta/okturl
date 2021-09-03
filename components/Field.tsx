import { ExclamationCircleIcon } from '@heroicons/react/solid'
import cx from 'classnames'
import React, { forwardRef, HTMLProps } from 'react'

const classes = {
  base: 'block w-full shadow-sm rounded-md',
  disabled: 'opacity-50 cursor-not-allowed',
  error:
    'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500',
  valid: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
}

type FieldProps = {
  id: string
  label: string
  error?: string
} & HTMLProps<HTMLInputElement>

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div>
      <label className={'block text-sm font-medium text-gray-700'} htmlFor={id}>
        {label}
        {error && (
          <span className="text-sm text-red-600 float-right">{error}</span>
        )}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          className={cx(classes.base, {
            [classes.error]: error,
            [classes.valid]: !error
          })}
          ref={ref}
          name={id}
          id={id}
          autoCapitalize="false"
          autoComplete="false"
          autoCorrect="false"
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  )
)

Field.displayName = 'Button'

export default Field
