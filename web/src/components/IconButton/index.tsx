import React, { ReactElement, CSSProperties } from 'react'
import { Tooltip } from 'antd'

interface Props {
  title: string
  icon: ReactElement
  style?: CSSProperties
  onClick?: () => void
}

export default function IconButton({
  title,
  icon,
  style,
  onClick,
}: Props): ReactElement {
  return (
    <Tooltip title={title} placement="bottom">
      <button style={style} onClick={onClick} className="lake-button">
        {icon}
      </button>
    </Tooltip>
  )
}
