import { getArticles, getCategorys } from '@/lib/api'
import { BLOG_NAME } from '@/common/config'
import { IArticleList, Tag as ITag, TagList } from '@/types'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Row, Col, Card, Timeline } from 'antd'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactElement } from 'react'
import Sider from '@/components/sider'

interface Props {
  tags: ITag[]
  articleData: IArticleList
}

export default function index({ articleData: res, tags }: Props): ReactElement {
  return (
    <Row gutter={24}>
      <Head>
        <title>归档-{BLOG_NAME}</title>
      </Head>
      <Col lg={{ span: 6 }} md={{ span: 6 }} xs={{ span: 24 }}>
        <Sider tags={tags} />
      </Col>
      <Col lg={{ span: 18 }} md={{ span: 18 }} xs={{ span: 24 }}>
        <div className="list-wrapper">
          <Card bordered={false}>
            <Timeline>
              {res.data.map((v, i) => {
                return (
                  <Timeline.Item
                    dot={<ClockCircleOutlined />}
                    color="red"
                    key={i}
                  >
                    <Link href="/post/:id" as={`/post/${v.id}`}>
                      <a>
                        <span className="mr">
                          {(v.createdAt as string).slice(0, 10)}
                        </span>
                        <span>{v.title}</span>
                      </a>
                    </Link>
                  </Timeline.Item>
                )
              })}
            </Timeline>
          </Card>
        </div>
      </Col>
    </Row>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { pageNum = '1', tag } = ctx.query

  const articleData = await getArticles({
    published: true,
    pageNum: pageNum as string,
    pageSize: '1000',
    tag: tag as string,
  })
  const category = await getCategorys<TagList>()
  return {
    props: {
      articleData,
      tags: category.data,
    },
  }
}
