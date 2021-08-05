import { FC } from 'react'

interface BlockedButtonType {
  buttonToBlock: JSX.Element
  buttonThatBlocks: JSX.Element
  block: boolean
}

const BlockedButton: FC<BlockedButtonType> = ({
  buttonToBlock,
  buttonThatBlocks,
  block = false,
  children
}) => {
  return (
    <>
      {buttonToBlock}
      {block && (
        <>
          <div className="relative -mt-5 filter drop-shadow-cover">
            {buttonThatBlocks}
          </div>
          {children}
        </>
      )}
    </>
  )
}

export default BlockedButton
