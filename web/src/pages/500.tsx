import { Result, Button } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'

export default function Custom404() {
  return (
    <div>
      <Head>
        <title>500-{BLOG_NAME}</title>
      </Head>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Link href="/">
            <a>
              <Button type="primary">Back Home</Button>
            </a>
          </Link>
        }
      />
    </div>
  )
}
