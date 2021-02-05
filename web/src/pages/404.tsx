import { Result, Button } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'

export default function Custom404() {
  return (
    <div>
      <Head>
        <title>404-{BLOG_NAME}</title>
      </Head>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
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
