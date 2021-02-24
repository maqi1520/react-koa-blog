import { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import Layout from '@/components/layout'
import LayoutProvider from '@/components/layout/LayoutProvider'
import '@/styles/index.less'
import '@/styles/globals.less'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
moment.defaultFormat = 'YYYY-MM-DD HH:mm'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <LayoutProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LayoutProvider>
    </ConfigProvider>
  )
}

export default MyApp
