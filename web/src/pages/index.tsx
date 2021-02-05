import { getArticles, getCategorys } from '@/lib/api'
import { List, Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import Sider from '@/components/sider'
import { Tag as ITag, IArticleList, TagList } from '@/types'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'
import { ArcitleItem } from '@/components/ArcitleItem'

export interface Props {
  articleData: IArticleList
  tags: ITag[]
}

export default function ListPage({
  tags,
  articleData: res,
}: Props): ReactElement {
  const router = useRouter()
  const { pageNum = '1' } = router.query

  const itemRender = (
    current: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactElement
  ) => {
    return (
      <Link as={`/page/${current}`} href={`/?pageNum=${current}`}>
        {originalElement}
      </Link>
    )
  }
  return (
    <Row gutter={24}>
      <Head>
        <title>{BLOG_NAME}</title>
      </Head>
      <Col lg={{ span: 6 }} md={{ span: 6 }} xs={{ span: 24 }}>
        <Sider tags={tags} />
      </Col>
      <Col lg={{ span: 18 }} md={{ span: 18 }} xs={{ span: 24 }}>
        <div className="list-wrapper">
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              current: +pageNum,
              pageSize: 10,
              itemRender,
              total: res?.total,
            }}
            dataSource={res?.data}
            renderItem={(item, index) => (
              <ArcitleItem key={index} item={item} />
            )}
          />
        </div>
      </Col>
    </Row>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { pageNum = '1' } = ctx.query
  const articleData = await getArticles({
    published: true,
    pageNum: pageNum as string,
    pageSize: '10',
  })
  const category = await getCategorys<TagList>()
  return {
    props: {
      articleData,
      tags: category.data,
    },
  }
}
