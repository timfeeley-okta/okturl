import {
  ArrowNarrowRightIcon,
  ClipboardCopyIcon,
  XIcon
} from '@heroicons/react/outline'
import { FC } from 'react'

type ConfirmationListType = {
  data: {
    id: number
    key: string
    url: string
  }[]
  removeConfirmation: (id: number) => void
}

export const ConfirmationList: FC<ConfirmationListType> = ({
  removeConfirmation,
  data
}) => {
  return (
    <div className="divide-y divide-gray-200">
      {data.map(({ id, key, url }) => (
        <div className="py-4 flex items-center" key={'confirmation_' + id}>
          <section className="flex-grow">
            <p className="text-xs text-gray-400 flex items-center">
              <span>{url}</span>
              <ArrowNarrowRightIcon className="w-3  text-gray-300 inline ml-0.5" />
            </p>
            <a href={key} className="underline text-blue-700">
              {key}
            </a>
          </section>
          <section className="divide-x">
            <button className="p-2">
              <ClipboardCopyIcon
                onClick={() => key && navigator.clipboard.writeText(key)}
                className="h-4"
              />
            </button>
            <button
              className="p-2"
              onClick={() => id && removeConfirmation(id)}>
              <XIcon className="h-4" />
            </button>
          </section>
        </div>
      ))}
    </div>
  )
}

export default ConfirmationList
