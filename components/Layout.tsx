import classed from '@/lib/classed'

const Layout = {
  Outer: classed(
    'div',
    'min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'
  ),
  Card: classed(
    'div',
    'bg-white p-8 shadow sm:rounded-lg sm:mx-auto sm:w-full sm:max-w-md'
  ),
  SmallerCard: classed(
    'div',
    'bg-white py-4 px-8  shadow sm:rounded-lg  sm:mx-auto sm:w-full sm:max-w-md'
  )
}

export default Layout
