import { FC, SVGProps } from 'react'

const Logo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 78 32"
    {...props}>
    <path
      fill="#6E6E78"
      fillRule="evenodd"
      d="M14.7411 16.0089c-.8925-.8926-2.3397-.8926-3.2322 0l-5.62502 5.625c-1.58291 1.5829-1.58291 4.1493.00001 5.7322 1.58291 1.5829 4.14931 1.5829 5.73221 0l2.5-2.5c.4882-.4881 1.2796-.4881 1.7678 0 .4881.4882.4881 1.2796 0 1.7678l-2.5 2.5c-2.5592 2.5592-6.70856 2.5592-9.26778 0s-2.55923-6.7086 0-9.2678l5.625-5.625c1.86888-1.8689 4.89888-1.8689 6.76778 0s1.8689 4.8989 0 6.7678l-5.625 5.625c-1.17852 1.1785-3.08927 1.1785-4.26778 0-1.17851-1.1785-1.17851-3.0893 0-4.2678l5.62498-5.625c.4882-.4881 1.2796-.4881 1.7678 0 .4881.4882.4881 1.2796 0 1.7678l-5.62501 5.625c-.2022.2022-.2022.53 0 .7322.2022.2022.53003.2022.73223 0l5.62498-5.625c.8926-.8925.8926-2.3397 0-3.2322z"
      clipRule="evenodd"
    />
    <path
      stroke="#6E6E78"
      strokeLinecap="round"
      strokeWidth="2.3"
      d="M15.15 25.35h61.7"
    />
    <path
      fill="#1D1D21"
      d="M25.09 22.315c3.045 0 5.271-2.226 5.271-5.544 0-3.276-2.205-5.544-5.271-5.544s-5.271 2.268-5.271 5.544c0 3.192 2.226 5.544 5.271 5.544zm0-2.079c-1.554 0-2.625-1.092-2.625-3.423s1.071-3.507 2.625-3.507 2.604 1.176 2.604 3.507c0 2.331-1.05 3.423-2.604 3.423zM39.4556 22h3.234l-4.977-6.237 4.41-4.221h-3.192l-4.683 4.641V7.3h-2.562V22h2.562v-2.94l1.701-1.596L39.4556 22z"
    />
    <path
      fill="#1D1D21"
      d="M46.7389 22h3.108v-2.1h-2.226c-.672 0-.966-.294-.966-.966v-5.397h2.772v-1.995h-2.772V8.245h-2.562v3.297h-2.268v1.995h2.268v5.796c0 1.659.945 2.667 2.646 2.667zM54.0237 22.315c2.058 0 3.024-1.344 3.444-2.037V22h2.541V11.542h-2.562v4.914c0 1.68-.378 3.717-2.373 3.717-1.113 0-1.806-.651-1.806-2.268v-6.363h-2.562v6.972c0 2.289 1.155 3.801 3.318 3.801zM62.0659 22h2.562v-4.41c0-2.562.945-3.633 3.171-3.633.378 0 .756.021 1.134.084v-2.625c-.189-.042-.399-.063-.693-.063-2.331 0-3.318 1.659-3.654 2.499v-2.31h-2.52V22zM72.8803 22.168c.357 0 .735-.084 1.134-.231v-1.596l-.546-.021c-.84-.084-1.218-.588-1.218-1.533V6.397h-2.52V19.06c0 1.743.462 3.108 3.15 3.108z"
    />
  </svg>
)

export default Logo