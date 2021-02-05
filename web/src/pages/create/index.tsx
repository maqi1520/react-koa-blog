import React, {
  ReactElement,
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from 'react'
import { Button, Input, message, Row, Col, Popover, Divider } from 'antd'
import CodeMirror from 'codemirror'
import {
  MinusOutlined,
  PictureOutlined,
  LinkOutlined,
  BoldOutlined,
  ItalicOutlined,
  FontSizeOutlined,
  RedoOutlined,
  UndoOutlined,
  StrikethroughOutlined,
  BarsOutlined,
  DoubleRightOutlined,
  CheckSquareOutlined,
  OrderedListOutlined,
  RetweetOutlined,
  TableOutlined,
  LeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PaperClipOutlined,
  CloudUploadOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import api, { getArticle } from '@/common/api'
import IconButton from '@/components/IconButton'
import Auth from '@/components/layout/Auth'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { markdownToHtml } from '@/common/markdown'
import { Article } from '@/types'
import { OnRef } from '@/components/codemirror'
import { OSSFile } from '@/components/oss-gallery'
import TagPanel from '@/components/TagPanel'
import Head from 'next/head'
import { BLOG_NAME } from '@/common/config'

const Codemirror = dynamic(() => import('@/components/codemirror'), {
  ssr: false,
})
const OssGallery = dynamic(() => import('@/components/oss-gallery'), {
  ssr: false,
})

import { Context, IContext } from '@/components/layout/LayoutProvider'

//const Markdown = dynamic(() => import('@/components/markdown'), { ssr: false })

// 插入内容
const HEADING = (t: string) => `## ${t || '标题'}`
const BOLD = (t: string) => `**${t || '粗体'}**`
const ITALIC = (t: string) => `_${t || '斜体'}_`
const STRIKETHROUGH = (t: string) => `~~${t || '删除线'}~~`
const UNORDERED_LIST = (t: string) => `- ${t || '无序列表'}`
const ORDERED_LIST = (t: string) => `1. ${t || '无序列表'}`
const CHECK_LIST = (t: string) => `- [ ] ${t || '可选列表'}`
const QUOTE = (t: string) => `> ${t || '引用'}`
const TABLE = () => `\n| | |\n|--|--|\n|  |  |`
const CODE = (t: string) => '\n```\n' + (t || '代码') + '\n```'
const LINK = (t: string) => `[${t || '链接'}](地址)`
const DIVIDER = () => '---'

export default function Create({ id }: { id: string }): ReactElement {
  const [state] = useContext(Context) as IContext
  const router = useRouter()
  const [data, setArticle] = useState<Article>({
    readedCount: 1,
    title: '',
    content: '',
  })
  useEffect(() => {
    if (id) {
      getArticle<Article>(id as string).then((res) => {
        setArticle(res)
      })
    }
  }, [id])

  const [height, setHeight] = useState<string | number>('100%')
  useEffect(() => {
    setHeight(document.body.clientHeight - 56 - 40 - 32)
  }, [])

  const previewRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<OnRef | null>(null)
  const [editable, setEditable] = useState<boolean>(true)

  const insertContent = useCallback((fn) => {
    editorRef.current?.insertText(fn)
  }, [])
  const handleUndo = useCallback(() => {
    editorRef.current?.editor.undo()
  }, [])
  const handleRedo = useCallback(() => {
    editorRef.current?.editor.redo()
  }, [])
  const insertHeading = useCallback(() => {
    insertContent(HEADING)
  }, [insertContent])
  const insertBold = useCallback(() => {
    insertContent(BOLD)
  }, [insertContent])
  const insertItalic = useCallback(() => {
    insertContent(ITALIC)
  }, [insertContent])
  const insertStrikethrough = useCallback(() => {
    insertContent(STRIKETHROUGH)
  }, [insertContent])
  const insertUnorderedList = useCallback(() => {
    insertContent(UNORDERED_LIST)
  }, [insertContent])
  const insertOrderedList = useCallback(() => {
    insertContent(ORDERED_LIST)
  }, [insertContent])
  const insertCheckList = useCallback(() => {
    insertContent(CHECK_LIST)
  }, [insertContent])
  const insertQuote = useCallback(() => {
    insertContent(QUOTE)
  }, [insertContent])
  const insertTable = useCallback(() => {
    insertContent(TABLE)
  }, [insertContent])
  const insertCode = useCallback(() => {
    insertContent(CODE)
  }, [insertContent])
  const insertLink = useCallback(() => {
    insertContent(LINK)
  }, [insertContent])
  const insertImage = useCallback(
    (changeCheckedList: OSSFile[]) => {
      const str = changeCheckedList
        .map((file) => `![${file.name}](${file.url})\n`)
        .join('')
      insertContent(str)
    },
    [insertContent]
  )

  const insertDivider = useCallback(() => {
    insertContent(DIVIDER)
  }, [insertContent])

  const setValue = useCallback((content) => {
    setArticle((prev) => ({ ...prev, content }))
  }, [])
  const setTitle = useCallback((title) => {
    setArticle((prev) => ({ ...prev, title }))
  }, [])

  const setCategories = useCallback((categories) => {
    setArticle((prev) => ({ ...prev, categories }))
  }, [])

  const setSummary = useCallback((summary) => {
    setArticle((prev) => ({ ...prev, summary }))
  }, [])

  const onEditorRef = useCallback((v: OnRef) => {
    editorRef.current = v
  }, [])

  const onScroll = useCallback((value: CodeMirror.ScrollInfo) => {
    if (previewRef.current) {
      previewRef.current.scrollTop =
        (previewRef.current.scrollHeight - previewRef.current.clientHeight) *
        (value.top / (value.height - value.clientHeight))
    }
  }, [])

  const handleSave = useCallback(
    async (published: boolean) => {
      if (data.title.trim() === '') {
        message.error('请输入标题')
        return
      }
      try {
        if (!data.id) {
          const { data: res } = await api.post('/article', {
            ...data,
            published,
          })
          if (res) {
            router.back()
          }
        } else {
          const { data: res } = await api.put(`/article/${data.id}`, {
            ...data,
            published,
          })
          if (res) {
            router.back()
          }
        }
      } catch (error) {
        message.error(error.message)
      }
    },
    [router, data]
  )

  const popContent = (
    <div style={{ width: 300 }}>
      <Input.TextArea
        placeholder="摘要"
        rows={4}
        value={data.summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <TagPanel selectedTags={data.categories} onChange={setCategories} />
      <Divider></Divider>
      <div className="text-center">
        <Button
          icon={<PaperClipOutlined />}
          onClick={() => handleSave(false)}
          style={{ marginRight: 20 }}
        >
          保存草稿
        </Button>
        <Button
          icon={<SaveOutlined />}
          type="primary"
          onClick={() => handleSave(true)}
        >
          确认发布
        </Button>
      </div>
    </div>
  )

  return (
    <Auth>
      <div className="create-page">
        <Head>
          <title>{`写文章-${BLOG_NAME}`}</title>
        </Head>
        <div className="create-header">
          <div className="back-btn">
            <Link href="/">
              <LeftOutlined style={{ fontSize: 18 }} />
            </Link>
          </div>
          <div className="input-box">
            <Input
              value={data.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入标题"
            />
          </div>
          <div className="header-action">
            <Popover
              placement="bottomRight"
              trigger="click"
              content={popContent}
            >
              <Button icon={<CloudUploadOutlined />} type="primary">
                保存
              </Button>
            </Popover>
          </div>
        </div>
        <div className="create-body">
          <div className="toolbar">
            <div className="toolbar-inner">
              <IconButton
                title="撤销"
                style={{ transform: 'rotate(90deg)' }}
                icon={<UndoOutlined />}
                onClick={handleUndo}
              />
              <IconButton
                title="重做"
                style={{ transform: 'rotate(-90deg)' }}
                icon={<RedoOutlined />}
                onClick={handleRedo}
              />
              <Divider type="vertical" />
              <IconButton
                title="标题"
                icon={<FontSizeOutlined />}
                onClick={insertHeading}
              />
              <Divider type="vertical" />
              <IconButton
                title="粗体"
                icon={<BoldOutlined />}
                onClick={insertBold}
              />
              <IconButton
                title="斜体"
                icon={<ItalicOutlined />}
                onClick={insertItalic}
              />
              <IconButton
                title="删除线"
                icon={<StrikethroughOutlined />}
                onClick={insertStrikethrough}
              />
              <Divider type="vertical" />
              <IconButton
                title="无序列表"
                icon={<BarsOutlined />}
                onClick={insertUnorderedList}
              />
              <IconButton
                title="有序列表"
                icon={<OrderedListOutlined />}
                onClick={insertOrderedList}
              />
              <IconButton
                title="可选列表"
                icon={<CheckSquareOutlined />}
                style={{ padding: '0 8px' }}
                onClick={insertCheckList}
              />
              <Divider type="vertical" />
              <IconButton
                title="引用"
                icon={<DoubleRightOutlined />}
                style={{ padding: '0 8px' }}
                onClick={insertQuote}
              />
              <IconButton
                title="表格"
                icon={<TableOutlined />}
                onClick={insertTable}
              />
              <IconButton
                title="代码"
                icon={<RetweetOutlined />}
                onClick={insertCode}
              />
              <Divider type="vertical" />
              <IconButton
                title="链接"
                icon={<LinkOutlined />}
                onClick={insertLink}
              />
              <OssGallery
                prefixDir={state.user ? state.user.id + '/' : undefined}
                onChange={insertImage}
              >
                <IconButton title="图片" icon={<PictureOutlined />} />
              </OssGallery>

              <Divider type="vertical" />
              <IconButton
                title="分割线"
                icon={<MinusOutlined />}
                onClick={insertDivider}
              />
              <IconButton
                title="预览"
                icon={editable ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => setEditable(!editable)}
              />
            </div>
          </div>
          <Row style={{ padding: 16 }} gutter={16}>
            <Col span={editable ? 12 : 24}>
              <div style={{ height, padding: 0 }} className="create-content">
                <Codemirror
                  prefixDir={state.user ? state.user.id + '/' : undefined}
                  onRef={onEditorRef}
                  className="markdown-editor"
                  value={data.content || ''}
                  onChange={setValue}
                  onScroll={onScroll}
                />
              </div>
            </Col>
            <Col span={editable ? 12 : 0}>
              {editable && (
                <div
                  ref={previewRef}
                  className=" create-content markdown-preview"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(data.content || '') as string,
                  }}
                  style={{ height }}
                ></div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Auth>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id = null } = ctx.query

  return {
    props: {
      id,
    },
  }
}
