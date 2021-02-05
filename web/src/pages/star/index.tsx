import { IStarList } from '@/types'
import { getStars } from '@/lib/api'
import { GetServerSideProps } from 'next'
import { List } from 'antd'
import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'

interface Props {
  starData: IStarList
}

export default function Page({ starData: res }: Props): ReactElement {
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
    <>
      <Head>
        <title>文章收藏-{BLOG_NAME}</title>
      </Head>
      <List
        className="star-list"
        header={<div className="star-header">文章收藏</div>}
        itemLayout="vertical"
        pagination={{
          current: +pageNum,
          pageSize: 10,
          itemRender,
          total: res?.total,
        }}
        dataSource={res.data}
        renderItem={(item) => (
          <List.Item key={item.id} extra={item.createdAt}>
            <List.Item.Meta
              description={[
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>,
              ]}
            />
          </List.Item>
        )}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { pageNum = '1' } = ctx.query
  const starData = await getStars({
    pageNum: pageNum as string,
    pageSize: '10',
  })
  return {
    props: {
      starData,
    },
  }
}
