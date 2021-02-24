import {
  CalendarOutlined,
  EyeOutlined,
  TagOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { List, message, Tag, Popconfirm, Tooltip } from 'antd'
import React, { useCallback, memo, ReactElement, useContext } from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { removeArticle } from '@/common/api'
import Router from 'next/router'
import moment from 'moment'
import { Context, IContext } from '@/components/layout/LayoutProvider'

export const IconText = ({ icon, text }: { icon: ReactElement; text: any }) => (
  <span>
    {icon}
    <span style={{ marginLeft: 8 }}>{text}</span>
  </span>
)

export interface Props {
  item: Article
}

export const ArcitleItem = memo(({ item }: Props) => {
  const [state] = useContext(Context) as IContext
  const userId = state.user?.id
  const handleRemove = useCallback(() => {
    removeArticle(item.id as string)
      .then(() => {
        message.success('删除成功！')
        Router.replace('/')
      })
      .catch((err) => {
        message.error(err.message)
      })
  }, [item.id])
  const actions = [
    !item.published && <Tag color="orange">待发布</Tag>,
    item.categories && (
      <IconText
        key="tag"
        icon={<TagOutlined />}
        text={item.categories.map((v, index) => (
          <Tag key={index} color="geekblue">
            {v.name}
          </Tag>
        ))}
      />
    ),
    <IconText
      key="time"
      icon={<CalendarOutlined />}
      text={moment(item.createdAt).fromNow()}
    />,
    <IconText
      key="count"
      icon={<EyeOutlined />}
      text={`${item.readedCount} 次预览`}
    />,
    item.userId === userId && (
      <span key="option">
        <Tooltip title="编辑">
          <Link href="/post/[id]/edit" as={`/post/${item.id}/edit`}>
            <EditOutlined />
          </Link>
        </Tooltip>

        <Popconfirm
          placement="top"
          title={'确认删除？'}
          onConfirm={handleRemove}
        >
          <DeleteOutlined style={{ marginLeft: 10 }} />
        </Popconfirm>
      </span>
    ),
  ].filter(Boolean)
  return (
    <List.Item actions={actions}>
      <Link href="/post/[id]" as={`/post/${item.id}`}>
        <a>
          <List.Item.Meta title={item.title} description={item.summary} />
        </a>
      </Link>
    </List.Item>
  )
})
