module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}'],

  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Public Sans', 'sans-serif'],
      mono: ['Courier New', 'mono']
    },
    extend: {
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
