import { getArticles } from '@/common/api'
import { List } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useContext } from 'react'
import { Tag as ITag, IArticleList } from '@/types'
import Link from 'next/link'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'
import { ArcitleItem } from '@/components/ArcitleItem'
import UserLayout from '@/components/UserLayout'
import { useQuery } from 'react-query'
import { Context, IContext } from '@/components/layout/LayoutProvider'

export interface Props {
  articleData: IArticleList
  tags: ITag[]
}

export default function UserArticle(): ReactElement {
  const [state] = useContext(Context) as IContext
  const router = useRouter()
  const { pageNum = '1', id: userId } = router.query

  let published
  if (!state.user || state.user?.id === userId) {
    published = true
  }

  const { data: res = { data: [], total: 0 } } = useQuery<
    IArticleList,
    Error,
    [string, string, boolean, string]
  >(
    ['userArticle', pageNum, published, userId],
    (key, pageNum, published, userId) => {
      if (userId) {
        return getArticles({
          published,
          userId,
          pageNum,
          pageSize: '10',
        })
      } else {
        return Promise.reject()
      }
    }
  )

  const itemRender = (
    current: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactElement
  ) => {
    return (
      <Link
        as={`/user/${userId}/article?pageNum=${current}`}
        href={{
          pathname: '/user/[id]/article',
          query: {
            pageNum: current,
          },
        }}
      >
        {originalElement}
      </Link>
    )
  }
  return (
    <UserLayout>
      <Head>
        <title>{BLOG_NAME}</title>
      </Head>
      <div className="list-wrapper">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            current: +pageNum,
            pageSize: 10,
            itemRender,
            total: res.total,
          }}
          dataSource={res.data}
          renderItem={(item, index) => <ArcitleItem key={index} item={item} />}
        />
      </div>
    </UserLayout>
  )
}
