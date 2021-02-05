import React, { ReactElement, useCallback, useState } from 'react'
import { Card, Empty } from 'antd'
import Reply from './Reply'
import { useQuery } from 'react-query'
import { getComments } from '@/common/api'
import { CommentList, Comment } from '@/types'
import List from './List'

interface Props {
  articleId: string
}

export default function Comments({ articleId }: Props): ReactElement {
  const {
    isLoading,
    error,
    data = { data: [], total: 0 },
    refetch,
  } = useQuery('commentList', () => getComments<CommentList>(articleId))
  const [reply, setReply] = useState<Comment | undefined>()
  const handleReply = useCallback((data) => {
    setReply(data)
  }, [])

  if (error) {
    return <Empty />
  }
  return (
    <Card loading={isLoading} className="mt" title="留言">
      <List articleId={articleId} reply={handleReply} data={data.data} />
      <Reply
        calcelReply={() => setReply(undefined)}
        reply={reply}
        articleId={articleId}
        reload={refetch}
      />
    </Card>
  )
}
