import cx from 'classnames'
import { HTMLProps } from 'react'
import { forwardRef } from 'react'

const classes = {
  motion: 'transition ease-in-out duration-300',
  base: 'inline-flex items-center border border-transparent',
  disabled: 'opacity-50 cursor-not-allowed',
  size: {
    normal: 'px-3 py-2 text-sm leading-4 font-medium rounded-md shadow-sm '
  },
  variant: {
    primary:
      'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    secondary:
      'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    muted:
      'border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  }
}

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'muted'
  size?: 'normal'
  type?: 'submit' | 'reset' | 'button'
} & Omit<HTMLProps<HTMLButtonElement>, 'size'>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      type = 'button',
      variant = 'primary',
      size = 'normal',
      disabled = false,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      type={type}
      className={cx(
        classes.base,
        classes.motion,
        classes.size[size],
        classes.variant[variant],
        disabled && classes.disabled,
        className
      )}
      {...props}>
      {children}
    </button>
  )
)

Button.displayName = 'Button'

export default Button
