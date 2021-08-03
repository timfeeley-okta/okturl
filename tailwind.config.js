module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}'],

  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Public Sans', 'sans-serif'],
      mono: ['Courier New', 'mono']
    },
    extend: {
      boxShadow: {
        cover: '0 -35px 35px #fff'
      },
      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards'
      },
      keyframes: {
        enter: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.9)', opacity: 0 }
        },
        'slide-in': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
      spacing: {
        34: '8.5rem'
      },
      colors: {
        oktablue: {
          50: '#325bac',
          100: '#2851a2',
          200: '#1e4798',
          300: '#143d8e',
          400: '#0a3384',
          500: '#00297a',
          600: '#001f70',
          700: '#001566',
          800: '#000b5c',
          900: '#000152'
        },
        'okta-mid-grey': '#D7D7DC'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
