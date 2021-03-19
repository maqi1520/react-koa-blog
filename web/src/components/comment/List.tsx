import React, { ReactElement } from 'react'
import { map } from 'lodash'
import { Comment as CommentItem } from '@/types'
import { Comment, Tooltip, Avatar } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

interface Props {
  data?: CommentItem[]
  articleId: string
  reply?: (data: CommentItem) => void
}

export default function List({ data, articleId, reply }: Props): ReactElement {
  return (
    <ul className="comment">
      {map(data, (item) => (
        <li className="comment-item" id={`comment-${item.id}`} key={item.id}>
          <Comment
            actions={
              reply
                ? [
                    <a className="mr5" key="link" href={`#comment-${item.id}`}>
                      #
                    </a>,
                    <span
                      key="reply"
                      title={`回复${item.name}的这条留言`}
                      aria-hidden
                      onClick={() => reply(item)}
                    >
                      回复
                    </span>,
                  ]
                : undefined
            }
            author={<a href={item.url}>{item.name}</a>}
            avatar={
              <Avatar style={{ backgroundColor: '#f56a00' }}>
                {item.name}
              </Avatar>
            }
            content={<p>{item.text}</p>}
            datetime={
              <Tooltip
                title={dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              >
                <span>{dayjs(item.createdAt).fromNow()}</span>
              </Tooltip>
            }
          />
          {item.children && <List articleId={articleId} data={item.children} />}
        </li>
      ))}
    </ul>
  )
}
