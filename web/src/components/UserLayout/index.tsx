import { Menu, Card } from 'antd'
import React, { ReactElement, ReactNode } from 'react'
import Link from 'next/link'
import '@/styles/header.less'
import { useRouter } from 'next/router'

interface Props {
  children: ReactNode[]
}

export default function UserLayout({ children }: Props): ReactElement {
  const router = useRouter()
  const { id } = router.query
  return (
    <div>
      <Menu mode="horizontal" selectedKeys={[router.route]}>
        <Menu.Item key={`/user/[id]`}>
          <Link href={`/user/${id}`}>个人资料</Link>
        </Menu.Item>
        <Menu.Item key={`/user/[id]/article`}>
          <Link href={`/user/${id}/article`}>文章</Link>
        </Menu.Item>
      </Menu>
      <Card bordered={false}>{children}</Card>
    </div>
  )
}
