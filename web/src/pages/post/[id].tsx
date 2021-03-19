import React, { ReactElement, useContext, useEffect } from 'react'
import { Card, Row, Col, Affix, Result, Button, Divider } from 'antd'
import { markdownToHtml, markdownToToc } from '@/common/markdown'
import { Article, IArticleList } from '@/types'
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons'
import { getArticle, getArticles } from '@/lib/api'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'
import Comment from '@/components/comment'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Context, IContext } from '@/components/layout/LayoutProvider'
import '@/styles/post.less'

const handleScroll = () => {
  Array.from(document.querySelectorAll('h2,h3,h4')).forEach((item) => {
    if (
      item.getBoundingClientRect().y < 200 &&
      item.getBoundingClientRect().y > 0
    ) {
      const current = document.querySelector(
        `.toc a[href="#${encodeURI(item.id)}"]`
      )
      if (current) {
        document.querySelectorAll(`.toc li`).forEach((li) => {
          li.className = ''
        })
        if (current.parentNode) {
          ;(current.parentNode as HTMLElement).className = 'active'
        }
      }
    }
  })
}

export default function ArticleDetail({
  data,
  recentArticles = [],
}: {
  recentArticles: Article[]
  data: Article
}): ReactElement {
  const [state] = useContext(Context) as IContext
  const userId = state.user?.id

  useEffect(() => {
    if (data.content) {
      document.addEventListener('scroll', handleScroll)
    }
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [data])

  if (!data) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link href="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    )
  }

  const extra = (
    <div className="content-extra">
      <CalendarOutlined style={{ marginRight: 8 }} />
      {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      <Divider type="vertical" />
      <EyeOutlined style={{ marginRight: 8, marginLeft: 8 }} />
      {data?.readedCount} 次预览
      {data.userId === userId && (
        <>
          <Divider type="vertical" />
          <Link href="/post/:id/edit" as={`/post/${data.id}/edit`}>
            <Button ghost size="small" type="primary">
              编辑
            </Button>
          </Link>
        </>
      )}
    </div>
  )

  return (
    <Row gutter={16}>
      <Head>
        <title>
          {data.title}-{BLOG_NAME}
        </title>
      </Head>
      <Col xs={{ span: 24 }} md={{ span: 18 }}>
        <Card>
          <div className="post-head">
            <h1>{data?.title}</h1>
            {extra}
          </div>

          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(data.content) as string,
            }}
          ></div>
        </Card>
        <Comment articleId={data?.id as string}></Comment>
      </Col>

      <Col xs={{ span: 0 }} md={{ span: 6 }}>
        <div className="recent-article">
          <Card bodyStyle={{ padding: 0 }} bordered={false}>
            <Divider orientation="left">最近文章</Divider>
            <ul className="recent-list">
              {recentArticles.map((v) => (
                <li key={v.id}>
                  <Link href="/post/:id" as={`/post/${v.id}`}>
                    <a>
                      <div>{v.title}</div>
                      <div className="meta">
                        <CalendarOutlined style={{ marginRight: 5 }} />
                        {dayjs(v.createdAt).fromNow()}
                        <Divider type="vertical" />
                        <EyeOutlined
                          style={{ marginRight: 5, marginLeft: 5 }}
                        />
                        {v.readedCount}
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <Affix offsetTop={20}>
          <div className="toc">
            <div className="toc-title">目录</div>
            <div
              className="toc-body"
              dangerouslySetInnerHTML={{ __html: markdownToToc(data.content) }}
            ></div>
          </div>
        </Affix>
      </Col>
    </Row>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query

  try {
    const res = await getArticles<IArticleList>({
      published: true,
      pageNum: '1',
      pageSize: '10',
    })
    const data = await getArticle(id as string)
    return {
      props: {
        recentArticles: res.data,
        data,
      },
    }
  } catch (error) {
    return {
      props: {
        data: null,
      },
    }
  }
}
