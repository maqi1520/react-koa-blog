import { Tag, Divider, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, {
  ReactElement,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { getCategorys } from '@/common/api'
import { TagList, Tag as ITag } from '@/types'
const { CheckableTag } = Tag

interface Props {
  selectedTags: ITag[] | undefined
  onChange: (tags: ITag[]) => void
}

export default function CategoryPanel({
  selectedTags = [],
  onChange,
}: Props): ReactElement {
  const inputRef = useRef<Input>(null)
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<ITag[]>([])
  const [inputVisible, setInputVisible] = useState(false)

  const reload = useCallback(() => {
    getCategorys<TagList>().then((res) => {
      setTags(res.data)
    })
  }, [])
  useEffect(() => {
    reload()
  }, [reload])

  const handleChange = useCallback(
    (tag, checked) => {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t.name !== tag.name)
      onChange(nextSelectedTags)
    },
    [selectedTags, onChange]
  )

  const handleInputConfirm = useCallback(async () => {
    if (inputValue && tags.findIndex((tag) => tag.name === inputValue) === -1) {
      setTags([...tags, { name: inputValue }])
    }
    setInputValue('')
    setInputVisible(false)
  }, [inputValue, tags])

  return (
    <div>
      <Divider>标签</Divider>
      <div className="category-list">
        {tags.map((tag) => (
          <CheckableTag
            className="ant-tag-green"
            key={tag.name}
            checked={selectedTags.findIndex((v) => v.name === tag.name) > -1}
            onChange={(checked) => handleChange(tag, checked)}
          >
            {tag.name}
          </CheckableTag>
        ))}
      </div>

      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={() => setInputVisible(true)}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </div>
  )
}
