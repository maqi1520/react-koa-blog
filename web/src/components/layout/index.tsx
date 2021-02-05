import { BackTop, Layout } from 'antd'
import React, { ReactElement } from 'react'
import Header from '../header'
import '@/styles/layout.less'
import { useRouter } from 'next/router'

const { Footer, Content } = Layout

interface Props {
  children: ReactElement
}
export default function PageLayout({ children }: Props) {
  const router = useRouter()
  if (
    router.pathname === '/login' ||
    router.pathname === '/create' ||
    router.pathname === '/gallery'
  ) {
    return children
  }
  return (
    <>
      <Layout className="wrapper">
        <Header />
        <Content className="wrapper-container">
          <div className="wrapper-content">{children}</div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Copyright © blog.maqib.cn 2020 浙ICP备17007919号-1
        </Footer>
      </Layout>
      <BackTop visibilityHeight={100} />
    </>
  )
}
