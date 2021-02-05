import React, { ReactElement, useContext } from 'react'
import { Result, Button, Spin } from 'antd'
import Link from 'next/link'

import { Context, IContext } from '@/components/layout/LayoutProvider'

interface Props {
  children: ReactElement
}

export default function Auth({ children }: Props): ReactElement {
  const [state] = useContext(Context) as IContext
  if (state.loading) {
    return (
      <Spin>
        <div style={{ height: '100vh' }} />
      </Spin>
    )
  }
  if (state.user) {
    return children
  }
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Link href="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  )
}
