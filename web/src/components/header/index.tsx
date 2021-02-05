import {
  BarsOutlined,
  EditOutlined,
  HomeOutlined,
  PlusOutlined,
  SmileTwoTone,
  StarOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row, Dropdown } from 'antd'
import Link from 'next/link'
import React, { ReactElement, useContext } from 'react'
import '@/styles/header.less'
import { useRouter } from 'next/router'
import { Context, IContext } from '@/components/layout/LayoutProvider'
import { BLOG_NAME } from '@/common/config'
const routes = [
  {
    icon: <HomeOutlined />,
    title: '首页',
    path: '/',
  },
  {
    icon: <EditOutlined />,
    title: '归档',
    path: '/archive',
  },
  {
    icon: <StarOutlined />,
    title: '收藏',
    path: '/star',
  },
  {
    icon: <TeamOutlined />,
    title: '关于',
    path: '/about',
  },
]
const { Header } = Layout

export default function PageHeader(): ReactElement {
  const [state] = useContext(Context) as IContext
  const router = useRouter()

  return (
    <Header className="header-container">
      <div className="header-content">
        <Row gutter={24}>
          <Col lg={{ span: 6 }} md={{ span: 6 }} xs={{ span: 18 }}>
            <h1 className="logo">
              <Link href="/">
                <a>
                  <SmileTwoTone type="smile" twoToneColor="#eb2f96" />
                  <span className="ml10">{BLOG_NAME}</span>
                </a>
              </Link>
            </h1>
          </Col>
          <Col lg={{ span: 15 }} md={{ span: 15 }} xs={{ span: 6 }}>
            <Menu
              overflowedIndicator={<BarsOutlined />}
              theme="light"
              mode="horizontal"
              selectedKeys={[router.pathname]}
            >
              {routes.map((item) => {
                return (
                  <Menu.Item key={item.path}>
                    <Link href={item.path}>
                      <a>
                        {item.icon}
                        <span className="nav-text">{item.title}</span>
                      </a>
                    </Link>
                  </Menu.Item>
                )
              })}
            </Menu>
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 0 }}>
            {state.loading === false ? (
              state.user ? (
                <Dropdown
                  arrow
                  placement="bottomCenter"
                  overlay={
                    <Menu style={{ width: 120 }}>
                      <Menu.Item icon={<HomeOutlined />}>
                        <Link href="/user/[id]" as={`/user/${state.user.id}`}>
                          <a>个人主页</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item icon={<StarOutlined />}>
                        <Link href="/create">
                          <a>加收藏</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item icon={<EditOutlined />}>
                        <Link href="/create">
                          <a>写文章</a>
                        </Link>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    type="primary"
                  />
                </Dropdown>
              ) : (
                <Link href="/login">
                  <Button size="small" type="primary">
                    登录
                  </Button>
                </Link>
              )
            ) : null}
          </Col>
        </Row>
      </div>
    </Header>
  )
}
