import React, { ReactElement } from 'react'
import { Form, Button, Input, Tooltip, Checkbox } from 'antd'

import { CloseSquareOutlined } from '@ant-design/icons'
import { addComments } from '@/common/api'

import { Comment } from '@/types'
const { Item, useForm } = Form

interface FormValues extends Comment {
  remember: boolean
}

interface Props {
  articleId: string
  reload: () => void
  reply: Comment | undefined
  calcelReply: () => void
}

export default function Reply({
  calcelReply,
  reply,
  articleId,
  reload,
}: Props): ReactElement {
  const [refForm] = useForm()
  const onFinish = (values: FormValues) => {
    const { remember, ...other } = values
    if (remember) {
      localStorage.setItem('comment_info_name', other.name)
      other.url && localStorage.setItem('comment_info_url', other.url)
      localStorage.setItem('comment_info_email', other.email)
    }
    addComments({ ...other, articleId, parentId: reply?.id }).then(() => {
      reload()
      refForm.setFieldsValue({
        text: '',
      })
    })
  }
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  }
  const tailWrap = {
    xs: { span: 24, offset: 0 },
    sm: { span: 12, offset: 4 },
  }
  const initialValues = {
    remember: true,
    name: localStorage.getItem('comment_info_name') || '',
    url: localStorage.getItem('comment_info_url') || '',
    email: localStorage.getItem('comment_info_email') || '',
  }
  return (
    <Form
      form={refForm}
      initialValues={initialValues}
      {...layout}
      onFinish={onFinish}
    >
      <Item name="text" rules={[{ required: true }]} label="您的留言">
        <Input.TextArea />
      </Item>
      <Item name="name" rules={[{ required: true }]} label="您的大名">
        <Input />
      </Item>
      <Item
        name="email"
        rules={[{ required: true, type: 'email' }]}
        label="电子邮件"
      >
        <Input />
      </Item>
      <Item rules={[{ type: 'url' }]} name="url" label="个人网址">
        <Input />
      </Item>
      <Item wrapperCol={tailWrap} name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Item>
      <Item wrapperCol={tailWrap}>
        <Button type="primary" htmlType="submit">
          发表
        </Button>
        <span className="pull-right">
          {reply ? (
            <span className="reply-info">
              回复：@ <em>{reply.name}</em>
              <Tooltip title="取消回复">
                <CloseSquareOutlined className="ml10" onClick={calcelReply} />
              </Tooltip>
            </span>
          ) : null}
        </span>
      </Item>
    </Form>
  )
}
