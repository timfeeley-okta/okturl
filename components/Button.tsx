import cx from 'classnames'
import { ButtonHTMLAttributes, FC } from 'react'
import { Spinner } from '../lib/icons'

interface ButtonType extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'XS' | 'SM' | 'MD' | 'LG' | 'XL'
  theme?: 'FILLED' | 'SECONDARY' | 'ALT_FILLED' | 'OUTLINE'
  disabled?: boolean
  waiting?: boolean
}

const Button: FC<ButtonType> = ({
  size = 'MD',
  theme = 'FILLED',
  disabled = false,
  waiting = false,
  children,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled}
    className={cx(
      props.className,
      'font-medium',
      {
        'shadow-sm text-white bg-green-500 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500':
          !disabled && theme === 'ALT_FILLED',
        'shadow-sm text-white bg-oktablue-500 hover:bg-oktablue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oktablue-500':
          !disabled && theme === 'FILLED',
        'shadow-sm bg-okta-mid-grey  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-gray-500':
          disabled && (theme === 'FILLED' || theme === 'ALT_FILLED'),
        'shadow-sm text-oktablue-700 bg-indigo-100 hover:bg-oktablue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oktablue-50':
          !disabled && theme === 'SECONDARY',
        'shadow-sm text-gray-700 bg-mid-gray bg-okta-mid-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-50':
          disabled && theme === 'SECONDARY',
        'border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500':
          !disabled && theme === 'OUTLINE',
        'border border-gray-300 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500':
          disabled && theme === 'OUTLINE'
      },
      {
        'px-2.5 py-1.5 text-xs rounded': size === 'XS',
        'px-4 py-2 text-sm rounded-md': size == 'SM',
        'px-4 py-2 text-base rounded-md': size === 'MD',
        'px-6 py-3 text-base rounded-md': size === 'LG',
        'p-4 text-base rounded-md': size === 'XL'
      }
    )}>
    {waiting && Spinner}
    {!waiting && children}
  </button>
)

export default Button
